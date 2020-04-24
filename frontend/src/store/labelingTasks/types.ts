export const CREATE_LABELING_TASK_START = 'CREATE_LABELING_TASK_START';
export const CREATE_LABELING_TASK_SUCCESS = 'CREATE_LABELING_TASK_SUCCESS';
export const CREATE_LABELING_TASK_ERROR = 'CREATE_LABELING_TASK_ERROR';

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

export type LabelingTasksActionTypes =
  | createLabelingTaskStart
  | createLabelingTaskSuccess
  | createLabelingTaskError;
  