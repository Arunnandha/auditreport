import { combineReducers } from "redux";
import reducer from "./reducer";
import loginReducer from "./loginReducer";

const rootReducer = combineReducers({
  reducer,
  loginReducer
});

export default rootReducer;
