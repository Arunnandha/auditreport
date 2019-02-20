import { action_contants } from "../actions/action-types.js";
import { updateAIdetailsToDB } from "../actions/services.js";
// export function forbiddenWordsMiddleware({ dispatch }) {
// return function(next) {
// return function(action) {
// // do your stuff
// if (action.type === ADD_ARTICLE) {
// const foundWord = forbiddenWords.filter(word =>
// action.payload.title.includes(word)
// );
// if (foundWord.length) {
// return dispatch({ type: "FOUND_BAD_WORD" });
// }
// }
// return next(action);
// };
// };
// }

export const validationAIDetailsMiddleware = ({
  dispatch
}) => next => action => {
  if (action.type === action_contants.AIDETAILS_VALIDATION) {
    let validationMsg = "";
    const {
      AuditInspection_EndDate,
      AuditInspection_StartDate,
      PortOfAuditInspection,
      ReportDate,
      ReportBy
    } = action.UpdatedDetails;

    if (AuditInspection_StartDate === null)
      validationMsg = " > Start date cannot be empty.~_ ";
    if (AuditInspection_EndDate === null)
      validationMsg = validationMsg + " End date cannot be empty.~_";
    if (PortOfAuditInspection === "")
      validationMsg =
        validationMsg + " Port of Audit inspection cannot be empty.~_";
    if (ReportDate === null)
      validationMsg = validationMsg + " Report date cannot be empty.~_";
    if (ReportBy === "")
      validationMsg = validationMsg + " Report by cannot be empty.~_";

    if (validationMsg.length > 0) {
      return dispatch({
        type: action_contants.VALIDATION_ERROR,
        payload: validationMsg
      });
    } else {
      var {
        UpdatedDetails,
        HistId,
        Origin,
        AI_ListID,
        Flag,
        VesselID
      } = action;
      updateAIdetailsToDB(
        UpdatedDetails,
        HistId,
        Origin,
        AI_ListID,
        Flag,
        VesselID,
        dispatch
      );
    }
  }
  next(action);
};
