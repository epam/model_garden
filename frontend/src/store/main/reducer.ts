import {
  MainActionTypes,
  SET_SELECTED_MENU_ITEM,
  GET_BUCKETS_START,
  GET_BUCKETS_SUCCESS,
} from "./types";
import {Bucket} from "../../models";

export interface MainState {
  selectedMenuItemIndex: number;
  isBucketsLoading: boolean;
  buckets: Bucket[];
}

const initialState: MainState = {
  selectedMenuItemIndex: 0,
  isBucketsLoading: false,
  buckets: [],
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
    case GET_BUCKETS_START:
      return {
        ...state,
        isBucketsLoading: true
      };
    case GET_BUCKETS_SUCCESS:
      return {
        ...state,
        isBucketsLoading: false,
        buckets: action.buckets,
      };
    default:
      return state;
  }
};
