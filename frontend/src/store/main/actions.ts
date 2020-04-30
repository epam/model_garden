import { AppThunk } from "../index";
import {
  Bucket,
  MainActionTypes,
  SET_SELECTED_MENU_ITEM,
  GET_BUCKET_NAMES_START,
  GET_BUCKET_NAMES_SUCCESS,
  GET_BUCKET_NAMES_ERROR,
} from "./types";
import { getBucketNamesRequest } from "../../api";

export function setSelectedMenuItem(menuItemIndex: number): MainActionTypes {
  return {
    type: SET_SELECTED_MENU_ITEM,
    menuItemIndex,
  };
}

export function getBucketNamesStart(): MainActionTypes {
  return {
    type: GET_BUCKET_NAMES_START,
  };
}

export function getBucketNamesSuccess(bucketNames: string[]): MainActionTypes {
  return {
    type: GET_BUCKET_NAMES_SUCCESS,
    bucketNames,
  };
}

export function getBucketNamesError(error: string): MainActionTypes {
  return {
    type: GET_BUCKET_NAMES_ERROR,
    error,
  };
}

export const getBucketNames = (): AppThunk => (dispatch) => {
  dispatch(getBucketNamesStart());
  return getBucketNamesRequest()
    .then((response) => dispatch(getBucketNamesSuccess(response.data.map((bucket: Bucket) => bucket.name))))
    .catch((error) => dispatch(getBucketNamesError(error.response.data.message)));
};
