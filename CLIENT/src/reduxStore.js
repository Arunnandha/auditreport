import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
let store = createStore(
  persistedReducer, // to persist the  exist value
  compose(
    applyMiddleware(thunk), //Async dispatch action
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  )
);
let persistor = persistStore(store);

export { store, persistor };
