import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TableStateProps, LabelingTaskStatus } from '../../models';
import { getLabelingTasksRequest, archiveTaskLabelingRequest, retryLabelingTaskRequest } from '../../api';

export interface TasksStatusesState {
  tasksLoading: boolean;
  count: number;
  tasks: LabelingTaskStatus[];
}

const initialState: TasksStatusesState = {
  tasksLoading: false,
  count: 0,
  tasks: []
};

export const getLabelingTasks = createAsyncThunk(
  'fetchLabelingTask',
  async ({ page, rowsPerPage, searchProps, filterStatus, sortOrder, sortField }: TableStateProps) => {
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

    const response = await getLabelingTasksRequest(params);
    return response;
  }
);

export const archiveLabelingTask = createAsyncThunk('archiveLabelingTask', async (taskIds: Array<number>) => {
  const response = await archiveTaskLabelingRequest(taskIds);
  return response.data.results;
});

// export const archiveLabelingTask = (taskIds: Array<number>, tableState: TableStateProps): AppThunk => (dispatch) => {
//   // dispatch(createLabelingTaskStart());
//   return archiveTaskLabelingRequest(taskIds)
//     .then(() => {
//       dispatch(getLabelingTasks(tableState));
//     })
//     .catch((error: any) => dispatch(setErrorAction(error)));
// };

export const retryLabelingTask = createAsyncThunk('retryLabelingTask', async (taskIds: Array<number>, tableState) => {
  const response = await retryLabelingTaskRequest(taskIds);
  return response.data.results;
});

// export const retryLabelingTask = (taskIds: Array<number>, tableState: TableStateProps): AppThunk => (dispatch) => {
//   // dispatch(createLabelingTaskStart());
//   return retryLabelingTaskRequest(taskIds)
//     .then(() => {
//       dispatch(getLabelingTasks(tableState));
//     })
//     .catch((error: any) => dispatch(setErrorAction(error)));
// };

const tasksStatusesSlice = createSlice({
  name: 'taskStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLabelingTasks.pending, (state) => {
        state.tasksLoading = true;
      })
      .addCase(getLabelingTasks.fulfilled, (state, action) => {
        state.tasksLoading = false;
        state.count = action.payload.count;
        state.tasks = action.payload.tasks;
      })
      .addCase(archiveLabelingTask.fulfilled, (state, action) => {
        action.meta.arg.map((item) => (state.tasks[item].status = 'archived'));
      })
      .addCase(retryLabelingTask.fulfilled, (state, action) => {});
  }
});

export const tasksStatusesReducer = tasksStatusesSlice.reducer;
