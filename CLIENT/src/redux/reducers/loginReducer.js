const initState = {
  userDetails: {},
  vslCodeList: [],
  isToShowAlert: false,
  alert: {},
  vesselID: -1
};

const loginReducer = (state = initState, action) => {
  switch (action.type) {
    case "GETVSLCODE":
      return {
        ...state,
        vslCodeList: action.vslCode
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        alert: action.alert,
        isToShowAlert: true
      };
    case "SUCCESS":
      return {
        ...state,
        userDetails: action.userDetails,
        vesselID: action.vesselID
      };

    case "xxx":
      return {
        ...state
      };
  }

  return state;
};

export default loginReducer;
