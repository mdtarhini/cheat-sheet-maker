import {
  SIGN_UP_FAILED,
  SIGN_UP_SUCCESS,
  SIGN_IN_SUCCESS,
  SIGN_IN_FAILED,
  USER_LOADED,
  USER_NOT_LOADED,
  SIGN_OUT,
  USER_EDITED,
  USER_NOT_EDITED,
  TOGGLE_IS_SIGNUP,
  USER_DELETED,
  USER_NOT_DELETED,
} from "../actions/auth/types";

const initialState = {
  isSignup: false,
  user: null,
  token: localStorage.getItem("token"),
  errMsg: { for: "", msg: "" },
};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_UP_FAILED:
    case SIGN_IN_FAILED:
    case USER_NOT_LOADED:
    case SIGN_OUT:
    case USER_DELETED:
      localStorage.removeItem("token");
      return {
        ...state,
        user: null,
        token: null,
        isSignup: false,
        errMsg: action.payload,
      };
    case SIGN_UP_SUCCESS:
    case SIGN_IN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        errMsg: { for: "", msg: "" },
      };
    case USER_LOADED:
      return {
        ...state,
        user: action.payload,
        errMsg: { for: "", msg: "" },
      };
    case USER_EDITED:
      return {
        ...state,
        user: action.payload,
        errMsg: { for: "", msg: "" },
      };
    case USER_NOT_EDITED:
    case USER_NOT_DELETED:
      return { ...state, errMsg: action.payload };
    case TOGGLE_IS_SIGNUP:
      return {
        ...state,
        isSignup: !state.isSignup,
        errMsg: { for: "", msg: "" },
      };
    default:
      return state;
  }
};

export default authReducer;
