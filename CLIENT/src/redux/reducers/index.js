import { combineReducers } from "redux";
import reducer from "./reducer";
import loginReducer from "./loginReducer";
import log from "./log";

const rootReducer = combineReducers({
  reducer,
  loginReducer,
  log
});

export default rootReducer;
