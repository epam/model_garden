export const LOGIN_START ='LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export interface LoginStart {
  type: typeof LOGIN_START;
}

export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
}

export interface LoginError {
  type: typeof LOGIN_ERROR;
  error: string;
}

export type AuthActionTypes =
  | LoginStart
  | LoginSuccess
  | LoginError;
  