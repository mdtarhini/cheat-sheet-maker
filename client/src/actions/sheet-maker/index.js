import {
  MOVE_CELL_UP,
  MOVE_CELL_DOWN,
  DELETE_CELL,
  ADD_CELL,
  SET_CELL_TITLE,
  SELECT_CELL,
  MOVE_ROW_UP,
  MOVE_ROW_DOWN,
  DELETE_ROW,
  ADD_ROW,
  UPDATE_ROW,
  SET_SHEET_SUCCESS,
  SET_SHEET_FAILED,
  UPDATE_SHEET_SUCCESS,
  UPDATE_SHEET_FAILED,
  DELETE_SHEET_SUCCESS,
  DELETE_SHEET_FAILED,
} from "./types";
import { HOME_PATH, SHEET_MAKER_PATH } from "../../routes/paths";
import axios from "axios";
import { tokenConfig } from "../auth";
import history from "../../history";
import { setOnoingServerActivity } from "../ongoing-on-server";

// Offline actions (no communication with the server)
export const moveCellDown = (cellIndex) => {
  return { type: MOVE_CELL_DOWN, payload: cellIndex };
};
export const moveCellUp = (cellIndex) => {
  return { type: MOVE_CELL_UP, payload: cellIndex };
};

export const deleteCell = (cellId) => {
  return { type: DELETE_CELL, payload: cellId };
};

export const addCell = () => {
  return { type: ADD_CELL };
};

export const setCellTitle = (cellId, value) => {
  return { type: SET_CELL_TITLE, payload: { cellId, value } };
};
export const moveRowDown = (cellId, rowIndex) => {
  return { type: MOVE_ROW_DOWN, payload: { cellId, rowIndex } };
};
export const moveRowUp = (cellId, rowIndex) => {
  return { type: MOVE_ROW_UP, payload: { cellId, rowIndex } };
};

export const deleteRow = (cellId, rowId) => {
  return { type: DELETE_ROW, payload: { cellId, rowId } };
};

export const addRow = (cellId) => {
  return { type: ADD_ROW, payload: cellId };
};
export const updateRow = (rowId, cellId, update) => {
  return { type: UPDATE_ROW, payload: { cellId, rowId, update } };
};

export const selectCell = (cellId) => {
  return { type: SELECT_CELL, payload: cellId };
};

// Online actions (communication with the server)

export const getAndSetSheet = (sheetId) => {
  return (dispatch, getState) => {
    if (getState().sheets?.data[sheetId]) {
      dispatch({
        type: SET_SHEET_SUCCESS,
        payload: getState().sheets.data[sheetId],
      });
    } else {
      dispatch(setOnoingServerActivity({ "getting-sheet-for-maker": true }));
      return axios
        .get(
          `/api/sheets/one-private-sheet/${sheetId}`,
          tokenConfig(getState().auth.token)
        )
        .then((res) => {
          dispatch({ type: SET_SHEET_SUCCESS, payload: res.data });
        })
        .catch((err) => {
          dispatch({ type: SET_SHEET_FAILED, payload: err.response.data.msg });
        })
        .finally(() => {
          dispatch(
            setOnoingServerActivity({ "getting-sheet-for-maker": false })
          );
        });
    }
  };
};

export const createSheet = (initialValues) => {
  return (dispatch, getState) => {
    dispatch(setOnoingServerActivity({ "saving-sheet": true }));
    return axios
      .post(
        "/api/sheets/new",
        initialValues,
        tokenConfig(getState().auth?.token)
      )
      .then((res) => {
        history.push(`${SHEET_MAKER_PATH}/${res.data}`);
      })
      .catch(() => {})
      .finally(() => {
        dispatch(setOnoingServerActivity({ "saving-sheet": false }));
      });
  };
};
export const updateSheet = (sheetId, updatedValues, pathAfterSaving) => {
  return (dispatch, getState) => {
    dispatch(setOnoingServerActivity({ "saving-sheet": true }));
    return axios
      .patch(
        `/api/sheets/${sheetId}`,
        updatedValues,
        tokenConfig(getState().auth?.token)
      )
      .then((res) => {
        dispatch({ type: UPDATE_SHEET_SUCCESS, payload: res.data });
        if (pathAfterSaving) {
          history.push(pathAfterSaving);
        }
      })
      .catch((err) => {
        dispatch({
          type: UPDATE_SHEET_FAILED,
          payload: err.response.data.msg,
        });
      })
      .finally(() => {
        dispatch(setOnoingServerActivity({ "saving-sheet": false }));
      });
  };
};

export const deleteSheet = (sheetId) => {
  return (dispatch, getState) => {
    dispatch(setOnoingServerActivity({ "deleting-sheet": true }));
    return axios
      .delete(`/api/sheets/${sheetId}`, tokenConfig(getState().auth?.token))
      .then(() => {
        dispatch({ type: DELETE_SHEET_SUCCESS, payload: sheetId });
        history.push(HOME_PATH);
      })
      .catch(() => {
        dispatch({ type: DELETE_SHEET_FAILED, payload: sheetId });
      })
      .finally(() => {
        dispatch(setOnoingServerActivity({ "deleting-sheet": false }));
      });
  };
};
