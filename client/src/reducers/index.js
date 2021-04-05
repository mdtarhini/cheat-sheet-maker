import { combineReducers } from "redux";

import authReducer from "./auth";
import sheetMakerReducer from "./sheet-maker";
import sheetsReducer from "./sheets";
import ongoingOnServerReducer from "./ongoing-on-server";
export default combineReducers({
  auth: authReducer,
  sheetMaker: sheetMakerReducer,
  sheets: sheetsReducer,
  ongoingOnServer: ongoingOnServerReducer,
});
