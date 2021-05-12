import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
//import { rootReducer } from ;

const INITIAL_STATE = {
    symbolsList: [
        {id: 0, symbol: "SPY", lots: []},
        {id: 1, symbol: "QQQ", lots: []},
    ],
    loading: false,
    data: '',
    error: '',
};

const rootReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "ADD_LOT":
            console.log('addLot: ')
             sym = action.payload.symbol.toUpperCase();
             
            let newSymbolsList = []
            
            for (let stock of state.symbolsList) {
                  if (stock.symbol == sym) {
                      stock.lots.push({shares: action.payload.shares,
                        sharePrice: action.payload.sharePrice,
                        date: action.payload.date
                      })
                      newSymbolsList.push(stock);
                      //console.log('newStock: ' + JSON.stringify(stock))
                  }
                 else {
                     newSymbolsList.push(stock);
                 };
             };
            newState = {...state, symbolsList: newSymbolsList};
            //console.log('apiSuccess - newState: ', JSON.stringify(newState))
          return( 
            {
            ...newState,
          });

        case "ADD_SYMBOL": 
            if (action.payload == "") return state; // check if symbol exists here
            newState = { ...state };
            //console.log({...action});
            
            let idx = newState.symbolsList.length; 
            
            newState = { ...newState, 
                symbolsList: [...newState.symbolsList, 
                    {id: idx , symbol: action.payload.toUpperCase(), lots: []}] };
            return newState;
        
          case "API_PENDING":
          return {
           ...state,
           loading: true,
          };
          case "API_SUCCESS":
            //console.log('apiSuccess - payload: ' + JSON.stringify(action.payload));
            
             sym = action.payload.symbol.toUpperCase();
             
            newSymbolsList = []
            
            for (let stock of state.symbolsList) {
                  if (stock.symbol == sym) {
                      stock = {...stock, data: action.payload.data};
                      newSymbolsList.push(stock);
                      //console.log('newStock: ' + JSON.stringify(stock))
                  }
                 else {
                     newSymbolsList.push(stock);
                 };
             };
            newState = {...state, symbolsList: newSymbolsList};
            //console.log('apiSuccess - newState: ', JSON.stringify(newState))
          return( 
            {
            ...newState,
           //data: action.payload, //  remove me
           loading: false,
          });
          case "API_ERROR":
           return {
               ...state,
               error: action.payload,
               loading: false,
           };
        case "DELETE_SYMBOL":
            newState= {...state};
           // console.log(action.payload)
            //newState.symbolsList.filter( (stock) => stock.symbol == action.payload.toUpperCase());
            let newSymbolList = []
           for (let stock of newState.symbolsList) {
              // console.log({...stock}, stock.symbol==action.payload)
               // i don't know why this works and filter doesn't
               // id's might need to be adjusted to avoid dupes
               if (stock.symbol !== action.payload) newSymbolList.push(stock)
           }
            newState = {... newState, symbolsList: newSymbolList}
            //console.log({...newState})
            return newState;
        default:
            return state;
    }
};

//make persist config
// stateRecon is bit complicated / comment for default?

const persistConfig = {
 key: 'root',
 storage: AsyncStorage,
 stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};


//const store = createStore(rootReducer, applyMiddleware(thunk));

//export { store};

//wrap rootReducer and persistConfig in persistReducer
const pReducer = persistReducer(persistConfig, rootReducer);

//create store from persistReducer
export const store = createStore(pReducer);

// wrap store in persistStore
export const persistor = persistStore(store);


