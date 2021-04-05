import {
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILED,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED,
  USER_LOADED,
  USER_NOT_LOADED,
  SIGN_OUT,
  TOGGLE_IS_SIGNUP,
  USER_EDITED,
  USER_NOT_EDITED,
  USER_DELETED,
  USER_NOT_DELETED,
} from "./types";
import { HOME_PATH } from "../../routes/paths";
import axios from "axios";
import history from "../../history";
import { setOnoingServerActivity } from "../ongoing-on-server";

export const toggleIsIsSignup = () => {
  return { type: TOGGLE_IS_SIGNUP };
};
export const signUp = ({ username, password }) => {
  return (dispatch) => {
    dispatch(setOnoingServerActivity({ authenticating: true }));
    return axios
      .post("/api/users/signup", { username, password })
      .then((res) => {
        dispatch({ type: SIGN_UP_SUCCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch({
          type: SIGN_UP_FAILED,
          payload: { for: "authentication", msg: err.response.data.msg },
        });
      })
      .finally(() => {
        dispatch(setOnoingServerActivity({ authenticating: false }));
      });
  };
};

export const signIn = ({ username, password }) => {
  return (dispatch) => {
    dispatch(setOnoingServerActivity({ authenticating: true }));
    return axios
      .post("/api/users/signin", { username, password })
      .then((res) => {
        dispatch({ type: SIGN_IN_SUCCESS, payload: res.data });
      })
      .catch((err) => {
        dispatch({
          type: SIGN_IN_FAILED,
          payload: { for: "authenticating", msg: err.response.data.msg },
        });
      })
      .finally(() => {
        dispatch(setOnoingServerActivity({ authenticating: false }));
      });
  };
};

export const signOut = () => {
  const noRedirectingPaths = /\/((sheet)|(user))\/.*/;
  if (!noRedirectingPaths.test(history.location.pathname)) {
    history.push(HOME_PATH);
  }
  return { type: SIGN_OUT };
};

export const loadUserByToken = () => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    const config = tokenConfig(token);
    if (config.headers["x-auth-token"]) {
      dispatch(setOnoingServerActivity({ authenticating: true }));
      return axios
        .get("/api/users/user", config)
        .then((res) => {
          dispatch({ type: USER_LOADED, payload: res.data.user });
        })
        .catch((err) => {
          dispatch({
            type: USER_NOT_LOADED,
            payload: { for: "authenticating", msg: err.response.data.msg },
          });
        })
        .finally(() => {
          dispatch(setOnoingServerActivity({ authenticating: false }));
        });
    }
  };
};

export const editPassword = ({ newPassword, oldPassword }) => {
  return (dispatch, getState) => {
    if (newPassword && oldPassword) {
      dispatch(setOnoingServerActivity({ "editing-password": true }));
      return axios
        .patch(
          "/api/users/edit-password",
          { newPassword, oldPassword },
          tokenConfig(getState().auth.token)
        )
        .then((res) => {
          dispatch({ type: USER_EDITED, payload: res.data });
        })
        .catch((err) => {
          dispatch({
            type: USER_NOT_EDITED,
            payload: { for: "editing-password", msg: err.response.data.msg },
          });
        })
        .finally(() => {
          dispatch(setOnoingServerActivity({ "editing-password": false }));
        });
    }
  };
};

export const deleteUser = (password) => {
  return (dispatch, getState) => {
    if (password) {
      dispatch(setOnoingServerActivity({ "deleting-user": true }));
      return axios
        .delete("/api/users/delete-user", {
          ...tokenConfig(getState().auth.token),
          data: { password },
        })
        .then((res) => {
          dispatch({ type: USER_DELETED });
          history.push(HOME_PATH);
        })
        .catch((err) => {
          dispatch({
            type: USER_NOT_DELETED,
            payload: { for: "deleting-user", msg: err.response.data.msg },
          });
        })
        .finally(() => {
          dispatch(setOnoingServerActivity({ "deleting-user": false }));
        });
    }
  };
};

export const tokenConfig = (token) => {
  // Headers:
  const config = {
    headers: {
      "content-type": "application/json",
    },
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
};
