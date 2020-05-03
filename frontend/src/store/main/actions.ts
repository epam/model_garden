import { AppThunk } from "../index";
import {
  MainActionTypes,
  SET_SELECTED_MENU_ITEM,
  GET_BUCKET_NAMES_START,
  GET_BUCKET_NAMES_SUCCESS,
} from "./types";
import { getBucketNamesRequest } from "../../api";
import { setErrorAction } from '../error';

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

export const getBucketNames = (): AppThunk => (dispatch) => {
  dispatch(getBucketNamesStart());
  return getBucketNamesRequest()
    .then((response) => dispatch(getBucketNamesSuccess(response.data)))
    .catch((error) => dispatch(setErrorAction(error)));
};
