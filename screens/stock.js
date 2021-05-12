import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, Text, View } from "react-native";
import { styles } from "../styles";
import { connect } from "react-redux";
import {
    Chart,
    Line,
    Area,
    HorizontalAxis,
    Tooltip,
    VerticalAxis,
} from "react-native-responsive-linechart";

export class StockScreen extends React.Component {
    
    constructor(props) {
        super(props);
        let sym = this.props.route.params.symbol;
        let stockData = this.props.symbolsList.filter(stock => stock.symbol == sym)[0];
        this.state =  {stockData};
        //console.log('stockConstruct: ' + Object.keys(this.state.stockData));
        var todayIdx = this.state.stockData.data.c.length - 1;
        //var todayPrice1 = this.state.stockData.data.c[todayIdx];
        console.log(sym);
//        console.log(todayIdx + " " + JSON.stringify(todayPrice1));
    }

    deleteSymbol = (sym) => {
        this.props.deleteSymbol(sym);
        this.props.navigation.goBack();
    }
    
    parseDate = (date) => {
        let shortDate = new Date(date * 1000).toDateString().split(" ");
        return shortDate[1] + " " + shortDate[2];
    }

    setColor = () => {
        let colors = ['#63e8ed', '#63ed68', '#ddf241', '#7041f2', '#d30a6f' ];
        let pick = Math.floor(Math.random() * colors.length);
        console.log('setColor: ' + pick + ' ' + colors[pick]);
        return colors[pick];
    }
    
    render() {
        let {symbol, data} = this.state.stockData;
        let todayPrice = data.c[data.c.length - 1];
        let yesterdayPrice = data.c[data.c.length - 2];
        //let weekPrice = data.c[data.c.length - 5];
        let chartArray = [];
        let priceMin = Math.min(...data.c);
        let priceMax = Math.max(...data.c);
        let dateMin = Math.min(...data.t);
        let dateMax = Math.max(...data.t);
        let vol = data.v[data.v.length - 1];
        let avgVol = Math.round(data.v.reduce((a, b) => a + b, 0) / 30);
    
        priceMin -= priceMin * 0.04;
        priceMax += priceMax * 0.024;

        for (let i = 0; i < data.c.length; i++) {
            chartArray.push({ x: Number(data.t[i]), y: Number(data.c[i]) });
        }

        return (
            <View style={styles.container}>
                <Text style={styles.white}> {symbol}</Text>
                <View style={styles.graphContainer}>
                    <Chart
                        style={styles.twoHundred}
                        data={chartArray}
                        padding={{
                            left: 40,
                            bottom: 20,
                            right: 20,
                            top: 20,
                        }}
                        xDomain={{ min: dateMin, max: dateMax }}
                        yDomain={{ min: priceMin, max: priceMax }}
                    >
                        <VerticalAxis
                            tickCount={11}
                            theme={{
                                labels: { 
                                    label: {color: 'white'},
                                    formatter: (v) => v.toFixed(2) },
                                
                            }}
                        />
                        <HorizontalAxis
                            tickCount={5}
                            theme={{
                                labels: {
                                    label: {color: 'white'},
                                    formatter: (v) => this.parseDate(v),
                                },
                            }}
                        />
                        <Area
                            theme={{
                                gradient: {
                                    from: { color: this.setColor() },
                                    to: { color: "black", opacity: 0.4 },
                                },
                            }}
                        />
                        <Line
                            theme={{
                                stroke: { color: "#ffa502", width: 5 },
                                scatter: {
                                    default: { width: 4, height: 4, rx: 2 },
                                },
                            }}
                            tooltipComponent={<Tooltip/>}
                        />
                    </Chart>
                </View>
        
                <View style={styles.listContainer}>
                    <Text style={styles.white}>Price: {todayPrice}</Text>
                    <Text style={styles.white}>
                        change:
                        {(todayPrice - yesterdayPrice).toFixed(2)} /{" "}
                        {(
                            ((todayPrice - yesterdayPrice) / yesterdayPrice) *
                            100
                        ).toFixed(2)}{" "}
                        %
                    </Text>
                    <Text style={styles.white}>30-Day High: {priceMax.toFixed(2)}</Text>
                    <Text style={styles.white}>30-Day Low: {priceMin.toFixed(2)}</Text>
                    <Text style={styles.white}>Volume: {vol}</Text>
                    <Text style={styles.white}>30-Day avg Vol.: {avgVol}</Text>
                    <Button
                        title="add lots"
                        onPress={() =>
                            this.props.navigation.navigate("AddLots", {
                                symbol: symbol,
                            })
                        }
                    />
                    <Button
                        title="remove symbol"
                        onPress={() => this.deleteSymbol(symbol)}
                    />
                </View>
                <StatusBar style="light" />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { symbolsList } = state;
    return { symbolsList };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addSymbol: (text) => dispatch({ type: "ADD_SYMBOL", payload: text }),
        deleteSymbol: (symbol) =>
            dispatch({ type: "DELETE_SYMBOL", payload: symbol }),
    }
}

export const ConnectedStockScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(StockScreen);
