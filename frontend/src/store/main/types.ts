import {Bucket} from "../../models";

export const SET_SELECTED_MENU_ITEM = 'SET_SELECTED_MENU_ITEM';
export const GET_BUCKETS_START = 'GET_BUCKETS_START';
export const GET_BUCKETS_SUCCESS = 'GET_BUCKETS_SUCCESS';

export interface setSelectedMenuItem {
  type: typeof SET_SELECTED_MENU_ITEM;
  menuItemIndex: number;
}

export interface getBucketsStart {
  type: typeof GET_BUCKETS_START;
}

export interface getBucketsSuccess {
  type: typeof GET_BUCKETS_SUCCESS;
  buckets: Bucket[];
}

export type MainActionTypes =
  | setSelectedMenuItem
  | getBucketsStart
  | getBucketsSuccess;
  
