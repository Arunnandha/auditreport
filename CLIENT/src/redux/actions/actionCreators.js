import * as action from "./action-types";

// when AI details edited It will triggered
export const EditedAIdetails = eidtedDetails => {
  return dispatch => {
    dispatch({
      type: action.EDIT_AI_DETAILS,
      EditAIdetails: eidtedDetails
    });
  };
};

//Error Logging Action Creator
export const errorLogAC = (error, errorInfo) => {
  return dispatch => {
    dispatch({
      type: action.LOGGING_ERR,
      errDetails: { errorMsg: error.message, errorInfo: errorInfo }
    });
  };
};
