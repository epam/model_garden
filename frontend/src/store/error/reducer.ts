import {
  ErrorActionTypes,
  SET_ERROR,
  CLEAR_ERROR
} from "./types";

export interface ErrorState {
  errorMessage: string;
}

const initialState: ErrorState = {
  errorMessage: ''
};

export const errorReducer = (
  state: ErrorState = initialState,
  action: ErrorActionTypes
): ErrorState => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        errorMessage: action.error.message || "Network Error"
      }
    case CLEAR_ERROR:
      return {
        ...state,
        errorMessage: ''
      }
    default:
      return state;
  }
};
