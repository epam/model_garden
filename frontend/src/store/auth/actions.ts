import { AppThunk } from '../index';
import { AuthActionTypes, LOGIN_START, LOGIN_SUCCESS, LOGIN_ERROR } from './types';
import { loginRequest } from '../../api';

export function loginStartAction(): AuthActionTypes {
  return {
    type: LOGIN_START
  }
}

export function loginSuccessAction(): AuthActionTypes {
  return {
    type: LOGIN_SUCCESS
  }
}

export function loginErrorAction(): AuthActionTypes {
  return {
    type: LOGIN_ERROR
  }
}

export const login = (username: string, password: string): AppThunk => dispatch => {
  dispatch(loginStartAction());
  return loginRequest(username, password)
    .then(data => dispatch(loginSuccessAction()))
    .catch(error => dispatch(loginErrorAction()));
};
