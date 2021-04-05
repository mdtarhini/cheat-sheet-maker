import { SET_ONGOING_SERVER_ACTIVITY } from "../actions/ongoing-on-server/types";

const ongoingOnServerReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_ONGOING_SERVER_ACTIVITY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default ongoingOnServerReducer;
