import "react-native-gesture-handler";
import React from "react";
import { Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { connect, Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./src/configureStore.js";
import { ConnectedHomeScreen } from "./screens/home";
import { ConnectedStockScreen } from "./screens/stock";
import { ConnectedAddLotsScreen } from "./screens/addLot";

/*
 * button for header bar
                        options={{
                            headerRight: () => (
                                <Button
                                    onPress={() => alert('This is a button!')}
                                    title="Info"
                                    color="#fff"
            />
                            ),
                        }}
*/
const Stack = createStackNavigator();

class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: { backgroundColor: "black" },
                        headerTintColor: "#fff",
                    }}
                >
                    <Stack.Screen name="Home" component={ConnectedHomeScreen}
                    />
                    <Stack.Screen
                        name="Stock"
                        component={ConnectedStockScreen}
                        options={({ route }) => ({ title: route.params.symbol})}
                    />
                    <Stack.Screen
                        name="AddLots"
                        component={ConnectedAddLotsScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

class Root extends React.Component {
    render() {
        return (
            <PersistGate loading={null} persistor={persistor}>
                <Provider store={store}>
                    <ConnectedApp />
                </Provider>
            </PersistGate>
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
    }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default Root;
