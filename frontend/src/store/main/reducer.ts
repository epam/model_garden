import {
  MainActionTypes,
  GET_BUCKETS_START,
  GET_BUCKETS_SUCCESS,
} from "./types";
import {Bucket} from "../../models";

export interface MainState {
  isBucketsLoading: boolean;
  buckets: Bucket[];
}

const initialState: MainState = {
  isBucketsLoading: false,
  buckets: [],
};

export const mainReducer = (
  state: MainState = initialState,
  action: MainActionTypes
): MainState => {
  switch (action.type) {
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
