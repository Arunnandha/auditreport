import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
// import { persistStore, persistReducer } from "redux-persist";
import { validationAIDetailsMiddleware } from "./redux/middleware/validationMiddleware";

// import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native

// const persistConfig = {
//   key: "root",
//   storage,
//   blacklist: ["LOGGING_ERR"]
// };

//const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk, validationAIDetailsMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  )
);

// let persistor = persistStore(store);

// export { store, persistor };

export default store;
