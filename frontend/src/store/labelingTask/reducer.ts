import {
  LabelingTaskActionTypes,
  GET_BUCKET_PATHS_START,
  GET_BUCKET_PATHS_SUCCESS,
  GET_LABELING_TOOL_USERS_START,
  GET_LABELING_TOOL_USERS_SUCCESS,
  GET_UNSIGNED_IMAGES_COUNT_START,
  GET_UNSIGNED_IMAGES_COUNT_SUCCESS,
  SET_CURRENT_BUCKET_ID,
  SET_CURRENT_PATH,
  CREATE_LABELING_TASK_START,
  CREATE_LABELING_TASK_SUCCESS,
  GET_LABELING_TASKS_START,
  GET_LABELING_TASKS_SUCCESS,
} from "./types";
import { LabelingToolUser } from "../../models/labelingToolUser";
import { LabelingTaskStatus } from "../../models";

export interface LabelingTasksState {
  isPathsLoading: boolean;
  paths: string[];
  isLabelingToolUsersLoading: boolean;
  labelingToolUsers: LabelingToolUser[];
  currentBucketId: string;
  currentPath: string;
  isImagesCountLoading: boolean;
  unsignedImagesCount: number;
  isLabelingTasksStatusesLoading: boolean;
  labelingTasksStatuses: LabelingTaskStatus[];
}

const initialState: LabelingTasksState = {
  isPathsLoading: false,
  paths: [],
  isLabelingToolUsersLoading: false,
  labelingToolUsers: [],
  currentBucketId: "",
  currentPath: "",
  isImagesCountLoading: false,
  unsignedImagesCount: 0,
  isLabelingTasksStatusesLoading: false,
  labelingTasksStatuses: [],
};

export const labelingTaskReducer = (
  state: LabelingTasksState = initialState,
  action: LabelingTaskActionTypes
): LabelingTasksState => {
  switch (action.type) {
    case GET_BUCKET_PATHS_START:
      return {
        ...state,
        isPathsLoading: true,
      };
    case GET_BUCKET_PATHS_SUCCESS:
      return {
        ...state,
        isPathsLoading: false,
        paths: action.paths,
      };
    case GET_LABELING_TOOL_USERS_START:
      return {
        ...state,
        isLabelingToolUsersLoading: true,
      };
    case GET_LABELING_TOOL_USERS_SUCCESS:
      return {
        ...state,
        isLabelingToolUsersLoading: false,
        labelingToolUsers: action.users,
      };
    case GET_UNSIGNED_IMAGES_COUNT_START:
      return {
        ...state,
        isImagesCountLoading: true,
      };
    case GET_UNSIGNED_IMAGES_COUNT_SUCCESS:
      return {
        ...state,
        isImagesCountLoading: false,
        unsignedImagesCount: action.imagesCount,
      };
    case SET_CURRENT_BUCKET_ID:
      return {
        ...state,
        currentBucketId: action.bucketId,
      };
    case SET_CURRENT_PATH:
      return {
        ...state,
        currentPath: action.path,
      };
    case CREATE_LABELING_TASK_START:
      return state;
    case CREATE_LABELING_TASK_SUCCESS:
      return state;
    case GET_LABELING_TASKS_START:
      return {
        ...state,
        isLabelingTasksStatusesLoading: true,
      };
    case GET_LABELING_TASKS_SUCCESS:
      return {
        ...state,
        isLabelingTasksStatusesLoading: false,
        labelingTasksStatuses: action.tasks,
      };
    default:
      return state;
  }
};
