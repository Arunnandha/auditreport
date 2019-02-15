import { action_contants } from "../actions/action-types";

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

export const forbiddenWordsMiddleware = store => next => action => {
  if (action.type === action_contants.CHECK_VALIDATION) {
    // AuditInspection_EndDate: null,
    // AuditInspection_StartDate: null,
    // PortOfAuditInspection: "",
    // ReportDate: null,
    // ReportBy: "",
    // dispatch({
    //     type: action_contants.CHECK_VALIDATION,
    //     payload: updatedDetails
    //   });
  }

  next(action);
};
