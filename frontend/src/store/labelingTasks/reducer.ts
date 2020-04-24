import {
  LabelingTasksActionTypes,
  CREATE_LABELING_TASK_START,
  CREATE_LABELING_TASK_SUCCESS,
  CREATE_LABELING_TASK_ERROR
} from "./types";

export interface TasksState {}

const initialState: TasksState = {};

export const authReducer = (
  state: TasksState = initialState,
  action: LabelingTasksActionTypes
): TasksState => {
  switch (action.type) {
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
