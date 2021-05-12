import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
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
import axios from "axios";

class HomeScreen extends React.Component {
    // there has got to be a better place for this to live
    // but this is where i got it to work
    apiCall = (sym) => {
        let today = new Date();
        today = Date.parse(today) / 1000; // api uses unix time
        let lastMonth = today - 60 * 60 * 24 * 30;
        const query = {
            symbol: sym,
            resolution: "D",
            from: lastMonth,
            to: today,
            token: "bu11htv48v6v4d3lk100",
        };
        const url = "https://finnhub.io/api/v1/stock/candle?";
        this.props.fetchData();

        return new Promise(() => {
            axios
                .get(url, { params: query })
                .then((response) => {
                    // update store on success
                    this.props.fetchSuccess({
                        symbol: sym,
                        data: response.data,
                    });
                })
                .catch((error) => {
                    this.props.fetchError(error);
                    console.log(error);
                });
        });
    };

    renderItem = ({ item, index }) => {
        let todayPrice = item?.data?.c[item.data.c.length - 1];
        let yesterdayPrice = item?.data?.c[item.data.c.length - 2];
        let lots = item?.lots;
        let totalShares = 0;
        let totalCost = 0;
        lots.forEach((item) => {
            totalShares += item.shares;
            totalCost += item.sharePrice * item.shares;
        });
        let avgCost = totalCost / totalShares;

        return (
            <View>
                <TouchableOpacity
                    style={styles.listItem}
                    onPress={() =>
                        this.props.navigation.navigate("Stock", {
                            symbol: item.symbol,
                        })
                    }
                >
                    <Text style={styles.white}> {item.symbol} </Text>
                    {item?.data ? (
                        <View>
                            <View style={styles.listRow}>
                                <Text style={styles.white}>
                                    {" "}
                                    Price: {todayPrice.toFixed(2)}
                                </Text>
                                <Text style={styles.white}>
                                    {" "}
                                    change:{" "}
                                    {(todayPrice - yesterdayPrice).toFixed(
                                        2
                                    )} /{" "}
                                    {(
                                        ((todayPrice - yesterdayPrice) /
                                            yesterdayPrice) *
                                        100
                                    ).toFixed(2)}{" "}
                                    %
                                </Text>
                            </View>
                            {lots.length ? (
                                <View style={styles.listRow}>
                                    <Text style={styles.white}>
                                        Shares: {totalShares}{" "}
                                    </Text>

                                    <Text style={styles.white}>
                                        Avg. Cost: {avgCost.toFixed(2)}{" "}
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    ) : (
                        <Text style={styles.white}> loading... </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    addSym = () => {
        return (
            <View>
                <TextInput
                    ref={(ref) => (this.textInputRef = ref)}
                    style={styles.textBox}
                    placeholder="add symbol"
                    autoCorrect={false}
                    placeholderTextColor={"white"}
                    onSubmitEditing={this.symToStore}
                />
            </View>
        );
    };

    symToStore = ({ nativeEvent: { text, eventCount, target } }) => {
        this.props.addSymbol(text);
        this.apiCall(text);
        this.textInputRef.clear();
    };

    parseDate = (date) => {
        let shortDate = new Date(date * 1000).toDateString().split(" ");
        return shortDate[1] + " " + shortDate[2];
    };

    sumPortfolio = () => {
        let totalCost = 0;
        let totalPrice = 0;
        let yesterdayTotalPrice = 0;
        let chartArray = [];

        for (let stock of this.props.symbolsList) {
            if (!stock.lots.length) {
                continue;
            }
            let shares = 0;
            let i = 0;

            // get number of shares and cost for stock and sum to total
            for (let lot of stock.lots) {
                totalCost += lot.shares * lot.sharePrice;
                shares += lot.shares;
            }

            totalPrice += shares * stock.data.c[stock.data.c.length - 1];
            yesterdayTotalPrice +=
                shares * stock.data.c[stock.data.c.length - 2];

            // put dates in chartArray.x if not already set
            if (!chartArray.length) {
                for (let day of stock.data.t) {
                    chartArray.push({ x: Number(day) });
                }
            }

            // sum prices to chartArray.x
            for (let dayPrice of stock.data.c) {
                if (chartArray[i].y) {
                    chartArray[i].y += shares * dayPrice;
                } else {
                    chartArray[i] = { ...chartArray[i], y: shares * dayPrice };
                }
                i++;
            }
        }
        //console.log(chartArray);

        // Get mins and maxes for chart domain.
        let dateMin = chartArray[0].x;
        let dateMax = chartArray[chartArray.length - 1].x;
        let priceMin = chartArray[0].y;
        let priceMax = chartArray[0].y;

        for (let pair of chartArray) {
            if (pair.y < priceMin) {
                priceMin = pair.y;
            } else if (pair.y > priceMax) {
                priceMax = pair.y;
            }
        }

        // Pad domain so chart looks nice.
        priceMin -= priceMin * 0.04;
        priceMax += priceMax * 0.025;

        return (
            <View style={styles.graphContainer}>
                <Chart
                    style={styles.twoHundred}
                    data={chartArray}
                    padding={{
                        left: 50,
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
                                label: { color: "white" },
                                formatter: (v) => v.toFixed(2),
                            },
                        }}
                    />
                    <HorizontalAxis
                        tickCount={5}
                        theme={{
                            labels: {
                                label: { color: "white" },
                                formatter: (v) => this.parseDate(v),
                            },
                        }}
                    />
                    <Area
                        theme={{
                            gradient: {
                                from: { color: "#ffa502" },
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
                <TouchableOpacity style={styles.listItem}>
                    <View style={styles.listRow}>
                        <Text style={styles.white}>
                            {" "}
                            Mkt. Value: {totalPrice.toFixed(2)}{" "}
                        </Text>
                        <Text style={styles.white}>
                            Total Change: {(totalPrice - totalCost).toFixed(2)}{" "}
                        </Text>
                    </View>
                    <View style={styles.listRow}>
                        <Text style={styles.white}>
                            Day Change:
                            {(totalPrice - yesterdayTotalPrice).toFixed(2)}{" "}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    componentDidMount() {
        // call api for each stock in portfolio
        for (let stock of this.props.symbolsList) {
            this.apiCall(stock.symbol);
        }
    }

    render() {
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={+150}
                behavior={"padding"}
                style={styles.container}
            >
                <Text style={styles.white}>welcome to stock app</Text>
                <View style={styles.container}>
                    <View style={styles.listContainer}>
                        <FlatList
                            data={this.props.symbolsList}
                            renderItem={this.renderItem}
                            keyExtractor={() => Math.random().toString()}
                            ListHeaderComponent={this.sumPortfolio}
                            ListFooterComponent={this.addSym}
                        />
                    </View>
                </View>
                <StatusBar style="light" />
            </KeyboardAvoidingView>
        );
    }
}

const mapStateToProps = (state) => {
    const { data, symbolsList } = state;
    return { data, symbolsList };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addSymbol: (text) => dispatch({ type: "ADD_SYMBOL", payload: text }),
        fetchData: () =>
            dispatch({
                type: "API_PENDING",
            }),
        fetchSuccess: (data) =>
            dispatch({
                type: "API_SUCCESS",
                payload: data,
            }),
        fetchError: (error) =>
            dispatch({
                type: "API_ERROR",
                payload: error,
            }),
    };
};

export const ConnectedHomeScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeScreen);
