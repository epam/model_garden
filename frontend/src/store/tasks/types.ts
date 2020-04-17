export const CREATE_TASK_START = 'CREATE_TASK_START';
export const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
export const CREATE_TASK_ERROR = 'CREATE_TASK_ERROR';

export interface createTaskStart {
  type: typeof CREATE_TASK_START;
}

export interface createTaskSuccess {
  type: typeof CREATE_TASK_SUCCESS;
  data: any;
}

export interface createTaskError {
  type: typeof CREATE_TASK_ERROR;
  error: any;
}

export type TasksActionTypes =
  | createTaskStart
  | createTaskSuccess
  | createTaskError;
  