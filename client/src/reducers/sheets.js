import {
  GET_SHEETS_SUCCESS,
  GET_SHEETS_FAILED,
  GET_SHEET_SUCCESS,
  SET_SORT_BY,
  SET_THERE_IS_MORE,
  GET_NP_SHEETS_SUCCESS,
} from "../actions/sheets/types";
import { SIGN_OUT, USER_DELETED } from "../actions/auth/types";
import {
  DELETE_SHEET_SUCCESS,
  UPDATE_SHEET_SUCCESS,
} from "../actions/sheet-maker/types";
import _ from "lodash";
import { filterAnObject } from "../helpers";

const sheetsReducer = (
  state = {
    data: {},
    errMsg: "",
    sortBy: "most-recent", //most-recent || most-popular
    thereIsMoreOnTheServer: true,
  },
  action
) => {
  switch (action.type) {
    case GET_SHEETS_SUCCESS:
      return {
        ...state,
        errMsg: "",
        thereIsMoreOnTheServer: action.payload.thereIsMoreOnTheServer,
        data: { ...state.data, ..._.keyBy(action.payload.sheets, "_id") },
      };
    case GET_NP_SHEETS_SUCCESS:
      return {
        ...state,
        errMsg: "",
        data: {
          ...state.data,
          ..._.keyBy(action.payload, "_id"),
        },
      };

    case DELETE_SHEET_SUCCESS:
      return {
        ...state,
        data: _.omit(state.data, action.payload),
      };
    case GET_SHEET_SUCCESS:
    case UPDATE_SHEET_SUCCESS:
      return {
        ...state,
        data: { ...state.data, [action.payload._id]: action.payload },
      };
    case GET_SHEETS_FAILED:
      return { ...state, errMsg: action.payload };
    case SET_SORT_BY:
      return {
        ...state,
        data: filterAnObject(state.data, (sheet) => !sheet.published),
        sortBy: action.payload,
      };
    case SET_THERE_IS_MORE:
      return {
        ...state,
        thereIsMoreOnTheServer: action.payload.thereIsMoreOnTheServer,
      };
    case SIGN_OUT:
    case USER_DELETED:
      return {
        ...state,
        data: filterAnObject(state.data, (sheet) => sheet.published),
      };
    default:
      return state;
  }
};

export default sheetsReducer;
