import {
  LabelingTaskActionTypes,
  GET_DATASETS_START,
  GET_DATASETS_SUCCESS,
  GET_LABELING_TOOL_USERS_START,
  GET_LABELING_TOOL_USERS_SUCCESS,
  GET_UNSIGNED_IMAGES_COUNT_START,
  GET_UNSIGNED_IMAGES_COUNT_SUCCESS,
  SET_CURRENT_BUCKET_ID,
  SET_CURRENT_DATASET_ID,
  CREATE_LABELING_TASK_START,
  CREATE_LABELING_TASK_SUCCESS,
  GET_LABELING_TASKS_START,
  GET_LABELING_TASKS_SUCCESS,
  CLEAR_NEW_LABELING_TASK
} from './types';
import { LabelingToolUser } from '../../models/labelingToolUser';
import { Dataset, LabelingTaskStatus } from '../../models';

export interface LabelingTasksState {
  isDatasetsLoading: boolean;
  datasets: Dataset[];
  isLabelingToolUsersLoading: boolean;
  labelingToolUsers: LabelingToolUser[];
  currentBucketId: string;
  currentDatasetId: string;
  isImagesCountLoading: boolean;
  unsignedImagesCount: number;
  isLabelingTasksStatusesLoading: boolean;
  labelingTasksStatuses: { count: number; tasks: LabelingTaskStatus[] };
  newTask: { location: string };
}

const initialState: LabelingTasksState = {
  isDatasetsLoading: false,
  datasets: [],
  isLabelingToolUsersLoading: false,
  labelingToolUsers: [],
  currentBucketId: '',
  currentDatasetId: '',
  isImagesCountLoading: false,
  unsignedImagesCount: 0,
  isLabelingTasksStatusesLoading: false,
  labelingTasksStatuses: { count: 0, tasks: [] },
  newTask: { location: '' }
};

export const labelingTaskReducer = (
  state: LabelingTasksState = initialState,
  action: LabelingTaskActionTypes
): LabelingTasksState => {
  switch (action.type) {
    case GET_DATASETS_START:
      return {
        ...state,
        isDatasetsLoading: true
      };
    case GET_DATASETS_SUCCESS:
      return {
        ...state,
        isDatasetsLoading: false,
        datasets: [...action.datasets]
          .sort((a: Dataset, b: Dataset) => (a.path > b.path ? 1 : -1))
          .map((dataset) => ({
            ...dataset,
            path: `${dataset.path.split('')[0] === '/' ? '' : '/'}${dataset.path}`
          }))
      };
    case GET_LABELING_TOOL_USERS_START:
      return {
        ...state,
        isLabelingToolUsersLoading: true
      };
    case GET_LABELING_TOOL_USERS_SUCCESS:
      return {
        ...state,
        isLabelingToolUsersLoading: false,
        labelingToolUsers: action.users
      };
    case GET_UNSIGNED_IMAGES_COUNT_START:
      return {
        ...state,
        isImagesCountLoading: true
      };
    case GET_UNSIGNED_IMAGES_COUNT_SUCCESS:
      return {
        ...state,
        isImagesCountLoading: false,
        unsignedImagesCount: action.imagesCount
      };
    case SET_CURRENT_BUCKET_ID:
      return {
        ...state,
        currentBucketId: action.bucketId
      };
    case SET_CURRENT_DATASET_ID:
      return {
        ...state,
        currentDatasetId: action.datasetId
      };
    case CREATE_LABELING_TASK_START:
      return state;
    case CREATE_LABELING_TASK_SUCCESS:
      return {
        ...state,
        newTask: action.newTask
      };
    case CLEAR_NEW_LABELING_TASK:
      return {
        ...state,
        newTask: { location: '' }
      };
    case GET_LABELING_TASKS_START:
      return {
        ...state,
        isLabelingTasksStatusesLoading: true
      };
    case GET_LABELING_TASKS_SUCCESS:
      return {
        ...state,
        isLabelingTasksStatusesLoading: false,
        labelingTasksStatuses: {
          tasks: action.tasksData.tasks,
          count: action.tasksData.count
        }
      };
    default:
      return state;
  }
};
