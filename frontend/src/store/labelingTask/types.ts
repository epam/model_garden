import { LabelingToolUser } from "../../models/labelingToolUser";
import { Dataset, LabelingTaskStatus } from "../../models";

export const GET_DATASETS_START = "GET_DATASETS_START";
export const GET_DATASETS_SUCCESS = "GET_DATASETS_SUCCESS";

export const GET_LABELING_TOOL_USERS_START = "GET_LABELING_TOOL_USERS_START";
export const GET_LABELING_TOOL_USERS_SUCCESS = "GET_LABELING_TOOL_USERS_SUCCESS";

export const GET_UNSIGNED_IMAGES_COUNT_START = "GET_UNSIGNED_IMAGES_COUNT_START";
export const GET_UNSIGNED_IMAGES_COUNT_SUCCESS = "GET_UNSIGNED_IMAGES_COUNT_SUCCESS";

export const SET_CURRENT_BUCKET_ID = "SET_CURRENT_BUCKET_ID";
export const SET_CURRENT_DATASET_ID = "SET_CURRENT_DATASET_ID";

export const CREATE_LABELING_TASK_START = "CREATE_LABELING_TASK_START";
export const CREATE_LABELING_TASK_SUCCESS = "CREATE_LABELING_TASK_SUCCESS";

export const CLEAR_NEW_LABELING_TASK = "CLEAR_NEW_LABELING_TASK";

export const GET_LABELING_TASKS_START = 'GET_LABELING_TASKS_START';
export const GET_LABELING_TASKS_SUCCESS = 'GET_LABELING_TASKS_SUCCESS';

export interface getDatasetsStart {
  type: typeof GET_DATASETS_START;
}

export interface getDatasetsSuccess {
  type: typeof GET_DATASETS_SUCCESS;
  datasets: Map<string, Dataset>;
}

export interface getLabelingToolUsersStart {
  type: typeof GET_LABELING_TOOL_USERS_START;
}

export interface getLabelingToolUsersSuccess {
  type: typeof GET_LABELING_TOOL_USERS_SUCCESS;
  users: LabelingToolUser[];
}

export interface getUnsignedImagesCountStart {
  type: typeof GET_UNSIGNED_IMAGES_COUNT_START;
}

export interface getUnsignedImagesCountSuccess {
  type: typeof GET_UNSIGNED_IMAGES_COUNT_SUCCESS;
  imagesCount: number;
}

export interface setCurrentBucketId {
  type: typeof SET_CURRENT_BUCKET_ID;
  bucketId: string;
}

export interface setCurrentDataset {
  type: typeof SET_CURRENT_DATASET_ID;
  datasetId: string;
}

export interface createLabelingTaskStart {
  type: typeof CREATE_LABELING_TASK_START;
}

export interface createLabelingTaskSuccess {
  type: typeof CREATE_LABELING_TASK_SUCCESS;
  newTask: {location: string};
}

export interface clearNewTaskData {
  type: typeof CLEAR_NEW_LABELING_TASK
}

export interface getLabelingTasksStart {
  type: typeof GET_LABELING_TASKS_START
}

export interface getLabelingTasksSuccess {
  type: typeof GET_LABELING_TASKS_SUCCESS;
  tasksData: {
    tasks: LabelingTaskStatus[];
    count: number
  }
}

export type LabelingTaskActionTypes =
  | getDatasetsStart
  | getDatasetsSuccess
  | getLabelingToolUsersStart
  | getLabelingToolUsersSuccess
  | getUnsignedImagesCountStart
  | getUnsignedImagesCountSuccess
  | setCurrentBucketId
  | setCurrentDataset
  | createLabelingTaskStart
  | createLabelingTaskSuccess
  | clearNewTaskData
  | getLabelingTasksStart
  | getLabelingTasksSuccess;
