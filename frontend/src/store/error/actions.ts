import {
  ErrorActionTypes,
  SET_ERROR,
  CLEAR_ERROR
} from "./types";

export function setErrorAction(error: Error): ErrorActionTypes {
  return {
    type: SET_ERROR,
    error,
  };
}

export function clearError(): ErrorActionTypes {
  return {
    type: CLEAR_ERROR
  }
}
