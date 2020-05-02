import {
  ErrorActionTypes,
  SET_ERROR
} from "./types";

export function setErrorAction(error: Error): ErrorActionTypes {
  return {
    type: SET_ERROR,
    error,
  };
}
