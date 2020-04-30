export const SET_SELECTED_MENU_ITEM = 'SET_SELECTED_MENU_ITEM';

export const GET_BUCKET_NAMES_START = 'GET_BUCKET_NAMES_START';
export const GET_BUCKET_NAMES_SUCCESS = 'GET_BUCKET_NAMES_SUCCESS';
export const GET_BUCKET_NAMES_ERROR = 'GET_BUCKET_NAMES_ERROR';

export interface Bucket {
  name: string;
}

export interface setSelectedMenuItem {
  type: typeof SET_SELECTED_MENU_ITEM;
  menuItemIndex: number;
}

export interface getBucketNamesStart {
  type: typeof GET_BUCKET_NAMES_START;
}

export interface getBucketNamesSuccess {
  type: typeof GET_BUCKET_NAMES_SUCCESS;
  bucketNames: string[];
}

export interface getBucketNamesError {
  type: typeof GET_BUCKET_NAMES_ERROR;
  error: string;
}

export type MainActionTypes =
  | setSelectedMenuItem
  | getBucketNamesStart
  | getBucketNamesSuccess
  | getBucketNamesError;
