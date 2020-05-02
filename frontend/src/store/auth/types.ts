export const LOGIN_START ='LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export interface LoginStart {
  type: typeof LOGIN_START;
}

export interface LoginSuccess {
  type: typeof LOGIN_SUCCESS;
}

export type AuthActionTypes =
  | LoginStart
  | LoginSuccess;
  