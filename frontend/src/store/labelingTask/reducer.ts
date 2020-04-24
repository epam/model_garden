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
import { LabelingToolUser } from "../../models/labelingToolUser";

export interface LabelingTasksState {
  isPathsLoading: boolean;
  paths: string[];
  pathsLoadingErrorMessage: string;
  isLabelingToolUsersLoading: boolean;
  labelingToolUsers: LabelingToolUser[];
  labelingToolUsersLoadingErrorMessage: string;
  currentBucketName: string;
  currentPath: string;
  isImagesCountLoading: boolean;
  unsignedImagesCount: number;
  unsignedImagesCountErrorMessage: string;
}

const initialState: LabelingTasksState = {
  isPathsLoading: false,
  paths: [],
  pathsLoadingErrorMessage: "",
  isLabelingToolUsersLoading: false,
  labelingToolUsers: [],
  labelingToolUsersLoadingErrorMessage: "",
  currentBucketName: "",
  currentPath: "",
  isImagesCountLoading: false,
  unsignedImagesCount: 0,
  unsignedImagesCountErrorMessage: "",
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
    case GET_BUCKET_PATHS_ERROR:
      return {
        ...state,
        isPathsLoading: false,
        pathsLoadingErrorMessage: action.error,
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
    case GET_LABELING_TOOL_USERS_ERROR:
      return {
        ...state,
        isLabelingToolUsersLoading: false,
        labelingToolUsersLoadingErrorMessage: action.error,
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
        unsignedImagesCount: action.imagesCount
      }
    case GET_UNSIGNED_IMAGES_COUNT_ERROR:
      return {
        ...state,
        isImagesCountLoading: false,
        unsignedImagesCountErrorMessage: action.error
      }
    case SET_CURRENT_BUCKET_NAME:
      return {
        ...state,
        currentBucketName: action.bucketName,
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
    case CREATE_LABELING_TASK_ERROR:
      return state;
    default:
      return state;
  }
};
