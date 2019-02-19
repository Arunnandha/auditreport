import { action_contants } from "./action-types.js";

// when AI details edited It will triggered
export const EditedAIdetails = eidtedDetails => {
  return dispatch => {
    dispatch({
      type: action_contants.EDIT_AI_DETAILS,
      EditAIdetails: eidtedDetails
    });
  };
};

//Error Logging Action Creator
export const errorLogAC = (error, errorInfo) => {
  return dispatch => {
    dispatch({
      type: action_contants.LOGGING_ERR,
      errDetails: { errorMsg: error.message, errorInfo: errorInfo }
    });
  };
};

export const setAuditTypeToStore = auditType => {
  return dispatch => {
    dispatch({
      type: action_contants.SET_AUDIT_TYPE,
      payload: auditType
    });
  };
};
export const userLogging = () => {
  return dispatch => {
    dispatch({
      type: action_contants.USER_LOGIN
    });
  };
};

export const validatingAIDetails = (
  updatedDetails,
  HistId,
  Origin,
  AI_ListID,
  flag,
  vesselID
) => {
  return dispatch => {
    dispatch({
      type: action_contants.AIDETAILS_VALIDATION,
      UpdatedDetails: updatedDetails,
      HistId: HistId,
      Origin: Origin,
      AI_ListID: AI_ListID,
      Flag: flag,
      VesselID: vesselID
    });
  };
};
