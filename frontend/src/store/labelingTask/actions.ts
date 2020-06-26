import { AppThunk } from '../index';
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
  CLEAR_NEW_LABELING_TASK
} from './types';
import { Dataset, LabelingTaskRequestData } from '../../models';
import {
  createLabelingTaskRequest,
  getDatasetsRequest,
  getLabelingToolUsersRequest,
  getUnsignedImagesCountRequest
} from '../../api';
import { LabelingToolUser } from '../../models/labelingToolUser';
import { setErrorAction } from '../error';

export function getBucketPathsStart(): LabelingTaskActionTypes {
  return {
    type: GET_DATASETS_START
  };
}

export function getDatasetsSuccess(datasets: Dataset[]): LabelingTaskActionTypes {
  return {
    type: GET_DATASETS_SUCCESS,
    datasets
  };
}

export function getLabelingToolUsersStart(): LabelingTaskActionTypes {
  return {
    type: GET_LABELING_TOOL_USERS_START
  };
}

export function getLabelingToolUsersSuccess(users: LabelingToolUser[]): LabelingTaskActionTypes {
  return {
    type: GET_LABELING_TOOL_USERS_SUCCESS,
    users
  };
}

export function getUnsignedImagesCountStart(): LabelingTaskActionTypes {
  return {
    type: GET_UNSIGNED_IMAGES_COUNT_START
  };
}

export function getUnsignedImagesCountSuccess(imagesCount: number) {
  return {
    type: GET_UNSIGNED_IMAGES_COUNT_SUCCESS,
    imagesCount
  };
}

export function setCurrentBucketId(bucketId: string): LabelingTaskActionTypes {
  return {
    type: SET_CURRENT_BUCKET_ID,
    bucketId
  };
}

export function setCurrentDatasetId(datasetId: string): LabelingTaskActionTypes {
  return {
    type: SET_CURRENT_DATASET_ID,
    datasetId
  };
}

export function createLabelingTaskStart(): LabelingTaskActionTypes {
  return {
    type: CREATE_LABELING_TASK_START
  };
}

export function createLabelingTaskSuccess(newTask: { location: string }): LabelingTaskActionTypes {
  return {
    type: CREATE_LABELING_TASK_SUCCESS,
    newTask
  };
}

export function clearNewTaskData(): LabelingTaskActionTypes {
  return {
    type: CLEAR_NEW_LABELING_TASK
  };
}

export const getDatasets = (bucketId: string): AppThunk => (dispatch) => {
  dispatch(getBucketPathsStart());
  return getDatasetsRequest(bucketId)
    .then((response) => dispatch(getDatasetsSuccess(response.data.results)))
    .catch((error) => dispatch(setErrorAction(error)));
};

export const getLabelingToolUsers = (): AppThunk => (dispatch) => {
  dispatch(getLabelingToolUsersStart());
  return getLabelingToolUsersRequest()
    .then((response) => dispatch(getLabelingToolUsersSuccess(response.data)))
    .catch((error) => {
      let errorMessage = error.message ? error : { message: 'Error Getting Users' };
      dispatch(setErrorAction(errorMessage));
    });
};

export const getUnsignedImagesCount = (datasetId: string): AppThunk => (dispatch) => {
  dispatch(getUnsignedImagesCountStart());
  return getUnsignedImagesCountRequest(datasetId)
    .then((response) => dispatch(getUnsignedImagesCountSuccess(response.data.count)))
    .catch((error) => dispatch(setErrorAction(error)));
};

export const createLabelingTask = (taskData: any): AppThunk => (dispatch, getState) => {
  const params: LabelingTaskRequestData = {
    task_name: taskData.taskName,
    dataset_id: getState().labelingTask.currentDatasetId,
    assignee_id: taskData.user,
    files_in_task: taskData.filesInTask,
    count_of_tasks: taskData.countOfTasks
  };

  dispatch(createLabelingTaskStart());
  return createLabelingTaskRequest(params).then((response) => {
    dispatch(
      createLabelingTaskSuccess({
        location: response.headers['location']
      })
    );
  });
};
