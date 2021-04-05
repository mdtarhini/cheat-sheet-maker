import { SET_ONGOING_SERVER_ACTIVITY } from "./types";

export const setOnoingServerActivity = (activityValuePairs) => {
  return { type: SET_ONGOING_SERVER_ACTIVITY, payload: activityValuePairs };
};
