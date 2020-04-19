import { AppThunk } from "../index";
import {
  TasksActionTypes,
  CREATE_TASK_START,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_ERROR,
} from "./types";
import { Task } from "../../models";
import { createTaskRequest } from "../../api";

export function createTaskStart(): TasksActionTypes {
  return {
    type: CREATE_TASK_START,
  };
}

export function createTaskSuccess(data: any): TasksActionTypes {
  return {
    type: CREATE_TASK_SUCCESS,
    data
  }
}

export function createTaskError(error: any): TasksActionTypes {
  return {
    type: CREATE_TASK_ERROR,
    error
  }
}

export const createTask = (taskData: Task): AppThunk => dispatch => {
  dispatch(createTaskStart());
  return createTaskRequest(taskData)
    .then((data) => dispatch(createTaskSuccess(data)))
    .catch((error) => dispatch(createTaskError(error)));
};
