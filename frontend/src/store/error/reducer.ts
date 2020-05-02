import {
  ErrorActionTypes,
  SET_ERROR
} from "./types";

export interface ErrorState {
  errorMessage: string;
}

const initialState: ErrorState = {
  errorMessage: ''
};

export const authReducer = (
  state: ErrorState = initialState,
  action: ErrorActionTypes
): ErrorState => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        errorMessage: action.error.message
      }
    default:
      return state;
  }
};
