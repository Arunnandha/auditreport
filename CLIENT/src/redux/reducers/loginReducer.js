import { action_contants } from "../actions/action-types";

const initState = {
  userDetails: {},
  vslCodeList: [],
  isToShowAlert: false,
  alert: {},
  vesselID: -1
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
        isToShowAlert: true
      };
    case action_contants.SUCCESS:
      return {
        ...state,
        userDetails: action.userDetails,
        vesselID: action.vesselID
      };
  }

  return state;
};

export default loginReducer;
