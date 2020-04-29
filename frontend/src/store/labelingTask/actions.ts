import { AppThunk } from "../index";
import {
  LabelingTaskActionTypes,
  GET_BUCKET_PATHS_START,
  GET_BUCKET_PATHS_SUCCESS,
  GET_BUCKET_PATHS_ERROR,
  GET_LABELING_TOOL_USERS_START,
  GET_LABELING_TOOL_USERS_SUCCESS,
  GET_LABELING_TOOL_USERS_ERROR,
  GET_UNSIGNED_IMAGES_COUNT_START,
  GET_UNSIGNED_IMAGES_COUNT_SUCCESS,
  GET_UNSIGNED_IMAGES_COUNT_ERROR,
  SET_CURRENT_BUCKET_NAME,
  SET_CURRENT_PATH,
  CREATE_LABELING_TASK_START,
  CREATE_LABELING_TASK_SUCCESS,
  CREATE_LABELING_TASK_ERROR,
} from "./types";
import { Task } from "../../models";
import {
  createLabelingTaskRequest,
  getBucketPathsRequest,
  getLabelingToolUsersRequest,
  getUnsignedImagesCountRequest,
} from "../../api";
import { LabelingToolUser } from "../../models/labelingToolUser";

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

export function getBucketPathsError(error: string): LabelingTaskActionTypes {
  return {
    type: GET_BUCKET_PATHS_ERROR,
    error,
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

export function getLabelingToolUsersError(
  error: string
): LabelingTaskActionTypes {
  return {
    type: GET_LABELING_TOOL_USERS_ERROR,
    error,
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

export function getUnsignedImagesCountError(error: string) {
  return {
    type: GET_UNSIGNED_IMAGES_COUNT_ERROR,
    error,
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

export function createLabelingTaskError(error: any): LabelingTaskActionTypes {
  return {
    type: CREATE_LABELING_TASK_ERROR,
    error,
  };
}

export const getBucketPaths = (bucketName: string): AppThunk => (dispatch) => {
  dispatch(getBucketPathsStart());
  return getBucketPathsRequest(bucketName)
    .then((response) => dispatch(getBucketPathsSuccess(response.data)))
    .catch((error) => dispatch(getBucketPathsError(error.response.data.message)));
};

export const getLabelingToolUsers = (): AppThunk => (dispatch) => {
  dispatch(getLabelingToolUsersStart());
  return getLabelingToolUsersRequest()
    .then((response) => dispatch(getLabelingToolUsersSuccess(response.data)))
    .catch((error) =>
      dispatch(getLabelingToolUsersError(error.response.data.message))
    );
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
    .catch((error) =>
      dispatch(getUnsignedImagesCountError(error.response.data.message))
    );
};

export const createLabelingTask = (taskData: Task): AppThunk => (dispatch) => {
  dispatch(createLabelingTaskStart());
  return createLabelingTaskRequest(taskData)
    .then((response) => dispatch(createLabelingTaskSuccess(response.data)))
    .catch((error) =>
      dispatch(createLabelingTaskError(error.response.data.message))
    );
};
