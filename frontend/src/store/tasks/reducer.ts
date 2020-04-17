import {
  TasksActionTypes,
  CREATE_TASK_START,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_ERROR
} from "./types";

export interface TasksState {}

const initialState: TasksState = {};

export const authReducer = (
  state: TasksState = initialState,
  action: TasksActionTypes
): TasksState => {
  switch (action.type) {
    case CREATE_TASK_START:
      return state;
    case CREATE_TASK_SUCCESS:
      return state;
    case CREATE_TASK_ERROR:
      return state;
    default:
      return state;
  }
};
