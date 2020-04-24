import {
  MainActionTypes,
  SET_SELECTED_MENU_ITEM,
  GET_BUCKET_NAMES_START,
  GET_BUCKET_NAMES_SUCCESS,
  GET_BUCKET_NAMES_ERROR
} from "./types";

export interface MainState {
  selectedMenuItemIndex: number;
  isBucketNamesLoading: boolean;
  bucketNames: string[];
  bucketNamesErrorMessage: string;
}

const initialState: MainState = {
  selectedMenuItemIndex: 0,
  isBucketNamesLoading: false,
  bucketNames: [],
  bucketNamesErrorMessage: ''
};

export const mainReducer = (
  state: MainState = initialState,
  action: MainActionTypes
): MainState => {
  switch (action.type) {
    case SET_SELECTED_MENU_ITEM:
      return {
        ...state,
        selectedMenuItemIndex: action.menuItemIndex
      }
    case GET_BUCKET_NAMES_START:
      return {
        ...state,
        isBucketNamesLoading: true
      };
    case GET_BUCKET_NAMES_SUCCESS:
      return {
        ...state,
        isBucketNamesLoading: false,
        bucketNames: action.bucketNames
      };
    case GET_BUCKET_NAMES_ERROR:
      return {
        ...state,
        isBucketNamesLoading: false,
        bucketNamesErrorMessage: action.error
      }
    default:
      return state;
  }
};
