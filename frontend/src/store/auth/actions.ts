import { AppThunk } from "../index";
import {
  AuthActionTypes,
  LOGIN_START,
  LOGIN_SUCCESS,
} from "./types";
import { setErrorAction } from '../error';
import { loginRequest } from "../../api";

export function loginStartAction(): AuthActionTypes {
  return {
    type: LOGIN_START,
  };
}

export function loginSuccessAction(): AuthActionTypes {
  return {
    type: LOGIN_SUCCESS,
  };
}

export const login = (username: string, password: string): AppThunk => (
  dispatch
) => {
  dispatch(loginStartAction());
  return loginRequest(username, password)
    .then((response) => dispatch(loginSuccessAction()))
    .catch((error) => dispatch(setErrorAction(error)));
};
