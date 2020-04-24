import { LabelingToolUser } from "../../models/labelingToolUser";

export const GET_BUCKET_PATHS_START = "GET_BUCKET_PATHS_START";
export const GET_BUCKET_PATHS_SUCCESS = "GET_BUCKET_PATHS_SUCCESS";
export const GET_BUCKET_PATHS_ERROR = "GET_BUCKET_PATHS_ERROR";

export const GET_LABELING_TOOL_USERS_START = "GET_LABELING_TOOL_USERS_START";
export const GET_LABELING_TOOL_USERS_SUCCESS =
  "GET_LABELING_TOOL_USERS_SUCCESS";
export const GET_LABELING_TOOL_USERS_ERROR = "GET_LABELING_TOOL_USERS_ERROR";

export const GET_UNSIGNED_IMAGES_COUNT_START =
  "GET_UNSIGNED_IMAGES_COUNT_START";
export const GET_UNSIGNED_IMAGES_COUNT_SUCCESS =
  "GET_UNSIGNED_IMAGES_COUNT_SUCCESS";
export const GET_UNSIGNED_IMAGES_COUNT_ERROR =
  "GET_UNSIGNED_IMAGES_COUNT_ERROR";

export const SET_CURRENT_BUCKET_NAME = "SET_CURRENT_BUCKET_NAME";
export const SET_CURRENT_PATH = "SET_CURRENT_PATH";

export const CREATE_LABELING_TASK_START = "CREATE_LABELING_TASK_START";
export const CREATE_LABELING_TASK_SUCCESS = "CREATE_LABELING_TASK_SUCCESS";
export const CREATE_LABELING_TASK_ERROR = "CREATE_LABELING_TASK_ERROR";

export interface getBucketPathsStart {
  type: typeof GET_BUCKET_PATHS_START;
}

export interface getBucketPathsSuccess {
  type: typeof GET_BUCKET_PATHS_SUCCESS;
  paths: string[];
}

export interface getBucketPathsError {
  type: typeof GET_BUCKET_PATHS_ERROR;
  error: string;
}

export interface getLabelingToolUsersStart {
  type: typeof GET_LABELING_TOOL_USERS_START;
}

export interface getLabelingToolUsersSuccess {
  type: typeof GET_LABELING_TOOL_USERS_SUCCESS;
  users: LabelingToolUser[];
}

export interface getLabelingToolUsersError {
  type: typeof GET_LABELING_TOOL_USERS_ERROR;
  error: string;
}

export interface getUnsignedImagesCountStart {
  type: typeof GET_UNSIGNED_IMAGES_COUNT_START;
}

export interface getUnsignedImagesCountSuccess {
  type: typeof GET_UNSIGNED_IMAGES_COUNT_SUCCESS;
  imagesCount: number;
}

export interface getUnsignedImagesCountError {
  type: typeof GET_UNSIGNED_IMAGES_COUNT_ERROR;
  error: string;
}

export interface setCurrentBucketName {
  type: typeof SET_CURRENT_BUCKET_NAME;
  bucketName: string;
}

export interface setCurrentPath {
  type: typeof SET_CURRENT_PATH;
  path: string;
}

export interface createLabelingTaskStart {
  type: typeof CREATE_LABELING_TASK_START;
}

export interface createLabelingTaskSuccess {
  type: typeof CREATE_LABELING_TASK_SUCCESS;
  data: any;
}

export interface createLabelingTaskError {
  type: typeof CREATE_LABELING_TASK_ERROR;
  error: any;
}

export type LabelingTaskActionTypes =
  | getBucketPathsStart
  | getBucketPathsSuccess
  | getBucketPathsError
  | getLabelingToolUsersStart
  | getLabelingToolUsersSuccess
  | getLabelingToolUsersError
  | getUnsignedImagesCountStart
  | getUnsignedImagesCountSuccess
  | getUnsignedImagesCountError
  | setCurrentBucketName
  | setCurrentPath
  | createLabelingTaskStart
  | createLabelingTaskSuccess
  | createLabelingTaskError;
