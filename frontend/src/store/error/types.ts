export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export interface setError {
  type: typeof SET_ERROR;
  error: Error;
}

export interface clearError {
  type: typeof CLEAR_ERROR;
}

export type ErrorActionTypes = setError | clearError;
