import { AppThunk } from "../index";
import {
  LabelingTasksActionTypes,
  CREATE_LABELING_TASK_START,
  CREATE_LABELING_TASK_SUCCESS,
  CREATE_LABELING_TASK_ERROR,
} from "./types";
import { Task } from "../../models";
import { createLabelingTaskRequest } from "../../api";

export function createLabelingTaskStart(): LabelingTasksActionTypes {
  return {
    type: CREATE_LABELING_TASK_START,
  };
}

export function createLabelingTaskSuccess(data: any): LabelingTasksActionTypes {
  return {
    type: CREATE_LABELING_TASK_SUCCESS,
    data
  }
}

export function createLabelingTaskError(error: any): LabelingTasksActionTypes {
  return {
    type: CREATE_LABELING_TASK_ERROR,
    error
  }
}

export const createLabelingTask = (taskData: Task): AppThunk => dispatch => {
  dispatch(createLabelingTaskStart());
  return createLabelingTaskRequest(taskData)
    .then((data) => dispatch(createLabelingTaskSuccess(data)))
    .catch((error) => dispatch(createLabelingTaskError(error)));
};
