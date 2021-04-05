import {
  GET_SHEETS_SUCCESS,
  GET_SHEETS_FAILED,
  GET_SHEET_SUCCESS,
  SET_SORT_BY,
  SET_THERE_IS_MORE,
  GET_NP_SHEETS_SUCCESS,
} from "./types";
import { tokenConfig } from "../auth";
import axios from "axios";
import { setOnoingServerActivity } from "../ongoing-on-server";
import { FAVORITES_PATH, USER_PATH } from "../../routes/paths";
const MIN_NUMBER_OF_SHEETS = 25;
export const getSheets = ({ onlyIfCondition = false, match }) => {
  return (dispatch, getState) => {
    const { sortBy, data } = getState().sheets;

    let getParams;
    let getCondition;

    switch (match.path) {
      case `${USER_PATH}/:id`:
        getParams = { byUserId: match.params.id };
        getCondition =
          Object.keys(data).filter(
            (sheetId) =>
              data[sheetId].authorId === match.params.id &&
              data[sheetId].published
          ).length < MIN_NUMBER_OF_SHEETS;

        break;
      case FAVORITES_PATH:
        getParams = { favoredByUserId: getState().auth?.user?._id };
        getCondition =
          Object.keys(data).filter(
            (sheetId) =>
              data[sheetId].favorites.includes(getState().auth?.user?._id) &&
              data[sheetId].published
          ).length < MIN_NUMBER_OF_SHEETS;

        break;
      default:
        getParams = {};
        getCondition =
          Object.keys(data).filter((sheetId) => data[sheetId].published)
            .length < MIN_NUMBER_OF_SHEETS;
    }

    let currentSheetIds = Object.keys(data);

    if (onlyIfCondition) {
      if (getCondition) {
        dispatch(setOnoingServerActivity({ "getting-first-sheets": true }));
      } else {
        return axios
          .get(`/api/sheets/`, {
            params: { onlyThereIsMore: true, currentSheetIds, ...getParams },
          })
          .then((res) => {
            dispatch({ type: SET_THERE_IS_MORE, payload: res.data });
          });
      }
    } else {
      dispatch(setOnoingServerActivity({ "getting-more-sheets": true }));
    }

    return axios
      .get(`/api/sheets/`, {
        params: { currentSheetIds, sortBy, ...getParams },
      })
      .then((res) => {
        dispatch({ type: GET_SHEETS_SUCCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: GET_SHEETS_FAILED, payload: err.response.data.msg });
      })
      .finally(() => {
        dispatch(
          setOnoingServerActivity({
            "getting-first-sheets": false,
            "getting-more-sheets": false,
          })
        );
      });
  };
};

export const getNonPublishedSheets = () => {
  return (dispatch, getState) => {
    dispatch(setOnoingServerActivity({ "getting-non-published-sheets": true }));
    axios
      .get("/api/sheets/non-published", tokenConfig(getState().auth?.token))
      .then((res) => {
        dispatch({ type: GET_NP_SHEETS_SUCCESS, payload: res.data });
      })
      .finally(() => {
        dispatch(
          setOnoingServerActivity({ "getting-non-published-sheets": false })
        );
      });
  };
};

export const onSortByValueChange = ({ value, match }) => {
  return (dispatch) => {
    dispatch({ type: SET_SORT_BY, payload: value });
    dispatch(getSheets({ onlyIfCondition: true, match }));
  };
};

export const getOneSheet = (sheetId) => {
  return (dispatch) => {
    dispatch(setOnoingServerActivity({ "getting-one-sheet": true }));
    return axios
      .get(`/api/sheets/one-public-sheet/${sheetId}`)
      .then((res) => {
        dispatch({ type: GET_SHEET_SUCCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: GET_SHEETS_FAILED, payload: err.response.data.msg });
      })
      .finally(() => {
        dispatch(setOnoingServerActivity({ "getting-one-sheet": false }));
      });
  };
};

export const toggleFavorites = (sheetId) => {
  return (dispatch, getState) => {
    axios
      .patch(
        `/api/sheets/toggle-favorites/${sheetId}`,
        {},
        tokenConfig(getState().auth?.token)
      )
      .then((res) => {
        dispatch({ type: GET_SHEET_SUCCESS, payload: res.data });
      });
  };
};
