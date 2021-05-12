import { StyleSheet } from "react-native";

const WHITE = "white";
const BLACK = "black";
const GREY = "dimgrey";
const DARK = "#1e1e1e";
const ACCENT = "#230414";

export const styles = StyleSheet.create({
    bgWhite: {
        backgroundColor: "dimgrey",
    },
    center: {
        alignItems: "center",
    },
    container: {
        alignItems: "center",
        backgroundColor: BLACK,
        flex: 1,
        justifyContent: "center",
    },
    graphContainer: {
        //flex: 1,
        backgroundColor: BLACK,
        marginBottom: 10,
        //height: 100,
        width: 400,
    },
    listCol: {
        flexDirection: "column",
        padding: 4,
    },
    listContainer: {
        backgroundColor: BLACK,
        flex: 2,
        justifyContent: "space-around",
        width: 400,
    },
    listItem: {
        backgroundColor: DARK,
        borderColor: ACCENT,
        borderWidth: 1,
        flex: 1,
        height: 80,
        margin: 2,
        padding: 8,
    },
    listRow: {
        flexDirection: "row",
        margin: 4,
    },
    separator: {
        backgroundColor: WHITE,
        height: 2,
        margin: 4,
    },
    textBox: {
        borderColor: ACCENT,
        borderWidth: 1,
        color: WHITE,
        margin: 2,
        padding: 8,
    },
    twoHundred: {
        height: 200,
        width: 400,
    },
    white: {
        color: "white",
    },
});
