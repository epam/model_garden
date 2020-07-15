import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TableStateProps, LabelingTaskStatus } from '../../models';
import { getLabelingTasksRequest, archiveTaskLabelingRequest, retryLabelingTaskRequest } from '../../api';

export interface TasksStatusesState {
  loading: boolean;
  actualView: boolean;
  count: number;
  tasks: LabelingTaskStatus[];
}

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

export const retryLabelingTask = createAsyncThunk('retryLabelingTask', async (taskIds: Array<number>, tableState) => {
  const response = await retryLabelingTaskRequest(taskIds);
  return response.data.results;
});

const tasksStatusesSlice = createSlice({
  name: 'taskStatus',
  initialState: {
    loading: false,
    actualView: false,
    count: 0,
    tasks: []
  } as TasksStatusesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLabelingTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLabelingTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.actualView = true;
        state.count = action.payload.count;
        state.tasks = action.payload.tasks;
      })
      .addCase(archiveLabelingTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(archiveLabelingTask.fulfilled, (state) => {
        state.loading = false;
        state.actualView = false;
      })
      .addCase(retryLabelingTask.pending, (state) => {
        state.loading = false;
        state.actualView = false;
      })
      .addCase(retryLabelingTask.fulfilled, (state) => {
        state.actualView = false;
      });
  }
});

export const tasksStatusesReducer = tasksStatusesSlice.reducer;
