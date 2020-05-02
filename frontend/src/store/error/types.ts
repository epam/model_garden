export const SET_ERROR ='SET_ERROR';

export interface setError {
  type: typeof SET_ERROR;
  error: Error
}

export type ErrorActionTypes =
  | setError;
  