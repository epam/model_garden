import { AppThunk } from '../index';
import { LabelingTaskActionTypes, GET_LABELING_TASKS_START, GET_LABELING_TASKS_SUCCESS } from './types';
import { TableStateProps } from '../../models';
import { LabelingTaskStatus } from '../../models';
import { getLabelingTasksRequest, archiveTaskLabelingRequest, retryLabelingTaskRequest } from '../../api';
import { setErrorAction } from '../error';

export function getLabelingTasksStart(): LabelingTaskActionTypes {
  return {
    type: GET_LABELING_TASKS_START
  };
}

export function getLabelingTasksSuccess(tasksData: { count: number; tasks: LabelingTaskStatus[] }) {
  return {
    type: GET_LABELING_TASKS_SUCCESS,
    tasksData
  };
}

export const getLabelingTasks = ({
  page,
  rowsPerPage,
  searchProps,
  filterStatus,
  sortOrder,
  sortField
}: TableStateProps): AppThunk => (dispatch) => {
  dispatch(getLabelingTasksStart());

  const params: any = {
    page,
    page_size: rowsPerPage
  };

  if (sortOrder && sortField) {
    params.ordering = sortOrder === 'ascend' ? sortField : `-${sortField}`;
  }

  for (const [key, value] of Object.entries(searchProps)) {
    params[key] = Array(value)[0];
  }

  if (filterStatus) {
    params.status = filterStatus;
  }
  return getLabelingTasksRequest(params)
    .then((tasksData) => dispatch(getLabelingTasksSuccess(tasksData)))
    .catch((error) => dispatch(setErrorAction(error)));
};

export const archiveLabelingTask = (taskIds: Array<number>, tableState: TableStateProps): AppThunk => (dispatch) => {
  // dispatch(createLabelingTaskStart());
  return archiveTaskLabelingRequest(taskIds)
    .then(() => {
      dispatch(getLabelingTasks(tableState));
    })
    .catch((error: any) => dispatch(setErrorAction(error)));
};

export const retryLabelingTask = (taskIds: Array<number>, tableState: TableStateProps): AppThunk => (dispatch) => {
  // dispatch(createLabelingTaskStart());
  return retryLabelingTaskRequest(taskIds)
    .then(() => {
      dispatch(getLabelingTasks(tableState));
    })
    .catch((error: any) => dispatch(setErrorAction(error)));
};
