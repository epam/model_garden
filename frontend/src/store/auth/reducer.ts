import {
  AuthActionTypes,
  LOGIN_START,
  LOGIN_SUCCESS,
} from "./types";

export interface AuthState {}

const initialState: AuthState = {};

export const authReducer = (
  state: AuthState = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case LOGIN_START:
      return state;
    case LOGIN_SUCCESS:
      return state;
    default:
      return state;
  }
};
