import { createStore, compose, applyMiddleware } from "redux";
import reducer from "./redux/reducers/reducer.js";
import thunk from "redux-thunk";

const store = createStore(
  reducer,

  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
  )
);
export default store;
