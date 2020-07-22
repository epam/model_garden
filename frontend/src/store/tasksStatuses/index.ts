import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AppState } from '../index';
import { TableStateProps, LabelingTaskStatus } from '../../models';
import { getLabelingTasksRequest, archiveTaskLabelingRequest, retryLabelingTaskRequest } from '../../api';

export const getLabelingTasks = createAsyncThunk(
  'taskStatuses/fetchLabelingTask',
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

export const archiveLabelingTask = createAsyncThunk('taskStatuses/archiveLabelingTask', async (_, { getState }) => {
  const { tasksStatuses } = getState() as AppState;
  const response = await archiveTaskLabelingRequest(tasksStatuses.selectedRowKeys);
  return response.data.results;
});

export const retryLabelingTask = createAsyncThunk('taskStatuses/retryLabelingTask', async (_, { getState }) => {
  const { tasksStatuses } = getState() as AppState;
  const response = await retryLabelingTaskRequest(tasksStatuses.selectedRowKeys);
  return response.data.results;
});

export interface TasksStatusesState {
  loading: boolean;
  actualView: boolean;
  count: number;
  tasks: LabelingTaskStatus[];
  selectedRowKeys: number[];
  openConformationDialog: boolean;
}
const tasksStatusesSlice = createSlice({
  name: 'taskStatuses',
  initialState: {
    loading: false,
    actualView: false,
    count: 0,
    tasks: [],
    selectedRowKeys: [],
    openConformationDialog: false
  } as TasksStatusesState,
  reducers: {
    setSelectedRowKeys: (state, { payload }) => {
      state.selectedRowKeys = payload;
    },
    setOpenConformationDialog: (state, { payload }) => {
      state.openConformationDialog = payload;
    }
  },
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
        state.openConformationDialog = false;
        state.loading = true;
      })
      .addCase(archiveLabelingTask.rejected, (state) => {
        state.selectedRowKeys = [];
      })
      .addCase(archiveLabelingTask.fulfilled, (state) => {
        state.loading = false;
        state.actualView = false;
        state.selectedRowKeys = [];
      })

      .addCase(retryLabelingTask.pending, (state) => {
        state.loading = false;
        state.actualView = false;
      })
      .addCase(retryLabelingTask.rejected, (state) => {
        state.selectedRowKeys = [];
      })
      .addCase(retryLabelingTask.fulfilled, (state) => {
        state.actualView = false;
        state.selectedRowKeys = [];
      });
  }
});

export const tasksStatusesReducer = tasksStatusesSlice.reducer;
export const { setSelectedRowKeys, setOpenConformationDialog } = tasksStatusesSlice.actions;
