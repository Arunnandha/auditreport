import { action_contants } from "../actions/action-types.js";

const initState = {
  logDetails: []
};

const log = (state = initState, action) => {
  switch (action.type) {
    case action_contants.GET_LOG_DETAILS:
      return {
        ...state,
        logDetails: action.payload
      };
  }

  return state;
};

export default log;
