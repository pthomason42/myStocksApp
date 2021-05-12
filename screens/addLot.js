import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button, FlatList, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "../styles";
import { connect } from "react-redux";

export class AddLotsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    deleteSymbol = (sym) => {
        this.props.deleteSymbol(sym);
        this.props.navigation.goBack();
    }

    changeShares = ({ nativeEvent: { text, eventCount, target } }) => {
        this.setState({ shares: Number(text) });
    }

    changePrice = ({ nativeEvent: { text, eventCount, target } }) => {
        this.setState({ sharePrice: Number(text) });
    }

    changeDate = (event, date) => {
        this.setState({ date: date });
    }

    saveLot = () => {
        let shares = this.state.shares;
        let sharePrice = this.state.sharePrice;
        if (!shares || !sharePrice) {
            alert("no good!");
            return;
        }
        this.props.addLot({
            symbol: this.props.route.params.symbol,
            shares: shares,
            sharePrice: sharePrice,
            date: this.state.date,
        });
        this.shareRef.clear();
        this.priceRef.clear();
    }

    getLots = (sym) => {
        //console.log('getLots')
        for (let stock of this.props.symbolsList) {
            console.log(JSON.stringify(stock.symbol));
            if (stock.symbol == sym) {
                console.log("lots: " + JSON.stringify(stock.lots));
                return stock.lots;
            }
        }
    }

    renderItem = ({ item, index }) => {
        return (
            <View>
                <Text style={styles.white}> Shares: {item.shares}</Text>
                <Text style={styles.white}> Share Price: ${item.sharePrice.toFixed(2)}</Text>
                <Text style={styles.white}> Date: {new Date(item.date).toDateString()}</Text>
            </View>
        )
    }

    separator = () => {
        return <View style={styles.separator}></View>;
    }

    render() {
        let sym = this.props.route.params.symbol;
        let lots = this.getLots(sym);
        console.log("stockScreen: " + sym);
        return (
            <View style={styles.container}>
                <View style={styles.listContainer}>
                    <View style={styles.center}>
                        <Text style={styles.white}>{sym}</Text>
                    </View>
                    <Text style={styles.white}>shares:</Text>
                    <TextInput
                        ref={(ref) => (this.shareRef = ref)}
                        style={styles.textBox}
                        keyboardType={"numeric"}
                        onChange={this.changeShares}
                    />
                    <Text style={styles.white}>share price:</Text>
                    <TextInput
                        ref={(ref) => (this.priceRef = ref)}
                        style={styles.textBox}
                        keyboardType={"numeric"}
                        onChange={this.changePrice}
                    />
                    <Text style={styles.white}>date: </Text>
                    <View style={styles.bgWhite}>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.date}
                        mode={"date"}
                        is24Hour={true}
                        display={"spinner"}
                        onChange={this.changeDate}
                    />
                        </View>
                    <Button title="save lot" onPress={() => this.saveLot()} />
                    <FlatList
                        data={lots}
                        keyExtractor={() => Math.random().toString()}
                        renderItem={this.renderItem}
                        ItemSeparatorComponent={this.separator}
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
        addLot: (lot) => dispatch({ type: "ADD_LOT", payload: lot }),
    }
}

export const ConnectedAddLotsScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddLotsScreen);
