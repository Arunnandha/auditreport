import { action_contants } from "../actions/action-types.js";

const initState = {
  userDetails: {},
  vslCodeList: [],
  isToShowAlert: false,
  alert: {},
  vesselID: -1,
  isLoading: false
};

const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case action_contants.GETVSLCODE:
      return {
        ...state,
        vslCodeList: action.vslCode
      };
    case action_contants.LOGIN_ERROR:
      return {
        ...state,
        alert: action.alert,
        isToShowAlert: true,
        isLoading: false
      };
    case action_contants.USER_LOGIN:
      return {
        ...state,
        isLoading: true
      };
    case action_contants.SUCCESS:
      return {
        ...state,
        userDetails: action.userDetails,
        vesselID: action.vesselID,
        isLoading: false,
        isToShowAlert: false
      };
  }

  return state;
};

export default loginReducer;
