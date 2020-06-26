import { LabelingTaskActionTypes, GET_LABELING_TASKS_START, GET_LABELING_TASKS_SUCCESS } from './types';
import { LabelingTaskStatus } from '../../models';

export interface TasksStatusesState {
  isLabelingTasksStatusesLoading: boolean;
  count: number;
  tasks: LabelingTaskStatus[];
}

const initialState: TasksStatusesState = {
  isLabelingTasksStatusesLoading: false,
  count: 0,
  tasks: []
};

export const tasksStatusesReducer = (
  state: TasksStatusesState = initialState,
  action: LabelingTaskActionTypes
): TasksStatusesState => {
  switch (action.type) {
    case GET_LABELING_TASKS_START:
      return {
        ...state,
        isLabelingTasksStatusesLoading: true
      };
    case GET_LABELING_TASKS_SUCCESS:
      return {
        ...state,
        isLabelingTasksStatusesLoading: false,
        tasks: action.tasksData.tasks,
        count: action.tasksData.count
      };
    default:
      return state;
  }
};
