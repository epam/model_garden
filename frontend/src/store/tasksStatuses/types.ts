import { LabelingTaskStatus } from '../../models';

export const GET_LABELING_TASKS_START = 'GET_LABELING_TASKS_START';
export const GET_LABELING_TASKS_SUCCESS = 'GET_LABELING_TASKS_SUCCESS';

export interface getLabelingTasksStart {
  type: typeof GET_LABELING_TASKS_START;
}

export interface getLabelingTasksSuccess {
  type: typeof GET_LABELING_TASKS_SUCCESS;
  tasksData: {
    tasks: LabelingTaskStatus[];
    count: number;
  };
}

export type LabelingTaskActionTypes = getLabelingTasksStart | getLabelingTasksSuccess;
