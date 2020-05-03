import { AppThunk } from "../index";
import {
  LabelingTaskActionTypes,
  GET_BUCKET_PATHS_START,
  GET_BUCKET_PATHS_SUCCESS,
  GET_LABELING_TOOL_USERS_START,
  GET_LABELING_TOOL_USERS_SUCCESS,
  GET_UNSIGNED_IMAGES_COUNT_START,
  GET_UNSIGNED_IMAGES_COUNT_SUCCESS,
  SET_CURRENT_BUCKET_NAME,
  SET_CURRENT_PATH,
  CREATE_LABELING_TASK_START,
  CREATE_LABELING_TASK_SUCCESS,
  GET_LABELING_TASKS_START,
  GET_LABELING_TASKS_SUCCESS,
} from "./types";
import {
  LabelingTaskRequestData,
  LabelingTaskStatus,
} from "../../models";
import {
  createLabelingTaskRequest,
  getBucketPathsRequest,
  getLabelingToolUsersRequest,
  getUnsignedImagesCountRequest,
  getLabelingTasksRequest,
} from "../../api";
import { LabelingToolUser } from "../../models/labelingToolUser";
import { setErrorAction } from '../error';

export function getBucketPathsStart(): LabelingTaskActionTypes {
  return {
    type: GET_BUCKET_PATHS_START,
  };
}

export function getBucketPathsSuccess(
  paths: string[]
): LabelingTaskActionTypes {
  return {
    type: GET_BUCKET_PATHS_SUCCESS,
    paths,
  };
}

export function getLabelingToolUsersStart(): LabelingTaskActionTypes {
  return {
    type: GET_LABELING_TOOL_USERS_START,
  };
}

export function getLabelingToolUsersSuccess(
  users: LabelingToolUser[]
): LabelingTaskActionTypes {
  return {
    type: GET_LABELING_TOOL_USERS_SUCCESS,
    users,
  };
}

export function getUnsignedImagesCountStart(): LabelingTaskActionTypes {
  return {
    type: GET_UNSIGNED_IMAGES_COUNT_START,
  };
}

export function getUnsignedImagesCountSuccess(imagesCount: number) {
  return {
    type: GET_UNSIGNED_IMAGES_COUNT_SUCCESS,
    imagesCount,
  };
}

export function setCurrentBucketName(
  bucketName: string
): LabelingTaskActionTypes {
  return {
    type: SET_CURRENT_BUCKET_NAME,
    bucketName,
  };
}

export function setCurrentPath(path: string): LabelingTaskActionTypes {
  return {
    type: SET_CURRENT_PATH,
    path,
  };
}

export function createLabelingTaskStart(): LabelingTaskActionTypes {
  return {
    type: CREATE_LABELING_TASK_START,
  };
}

export function createLabelingTaskSuccess(data: any): LabelingTaskActionTypes {
  return {
    type: CREATE_LABELING_TASK_SUCCESS,
    data,
  };
}

export function getLabelingTasksStart(): LabelingTaskActionTypes {
  return {
    type: GET_LABELING_TASKS_START,
  };
}

export function getLabelingTasksSuccess(tasks: LabelingTaskStatus[]) {
  return {
    type: GET_LABELING_TASKS_SUCCESS,
    tasks,
  };
}

export const getBucketPaths = (bucketName: string): AppThunk => (dispatch) => {
  dispatch(getBucketPathsStart());
  return getBucketPathsRequest(bucketName)
    .then((response) => dispatch(getBucketPathsSuccess(response.data)))
    .catch((error) => dispatch(setErrorAction(error)));
};

export const getLabelingToolUsers = (): AppThunk => (dispatch) => {
  dispatch(getLabelingToolUsersStart());
  return getLabelingToolUsersRequest()
    .then((response) => dispatch(getLabelingToolUsersSuccess(response.data)))
    .catch((error) => dispatch(setErrorAction(error)));
};

export const getUnsignedImagesCount = (
  bucketName: string,
  bucketPath: string
): AppThunk => (dispatch) => {
  dispatch(getUnsignedImagesCountStart());
  return getUnsignedImagesCountRequest(bucketName, bucketPath)
    .then((response) =>
      dispatch(getUnsignedImagesCountSuccess(response.data.count))
    )
    .catch((error) => dispatch(setErrorAction(error)));
};

export const createLabelingTask = (
  taskData: LabelingTaskRequestData
): AppThunk => (dispatch) => {
  dispatch(createLabelingTaskStart());
  return createLabelingTaskRequest(taskData)
    .then((response) => dispatch(createLabelingTaskSuccess(response.data)))
    .catch((error) => dispatch(setErrorAction(error)));
};

export const getLabelingTasks = (
  bucketName: string,
  bucketPath: string
): AppThunk => (dispatch) => {
  dispatch(getLabelingTasksStart());
  return getLabelingTasksRequest(bucketName, bucketPath)
    .then((tasks) => dispatch(getLabelingTasksSuccess(tasks)))
    .catch((error) => dispatch(setErrorAction(error)));
};
