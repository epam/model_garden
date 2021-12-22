import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TAppState } from '../index';
import { IMappedTableParams, ITableStateProps, ILabelingTaskStatus, ILabelingTasksResponse } from '../../models';
import { getLabelingTasksRequest, archiveTaskLabelingRequest, retryLabelingTaskRequest } from '../../api';
import { compose } from '../../utils';

interface ITasksStatusesState {
  loading: boolean; // Used to show (or not) the icon flag when the TasksStatuses' table is refreshed/loaded.
  actualView: boolean; // Used to know if the table was updated based on archiveLabelingTask promise statuses.
  count: number; // Used to know the total ammount of task for pagination.
  tasks: ILabelingTaskStatus[]; // Used to store labeled task info and display task lists.
  selectedRowKeys: number[]; // Contains the selected rows from the list.
  openConformationDialog: boolean;
}

const getStatusesState = (
  loading: boolean = false,
  actualView: boolean = false,
  count: number = 0,
  tasks: ILabelingTaskStatus[] = [],
  selectedRowKeys: number[] = [],
  openConformationDialog: boolean = false
): ITasksStatusesState => ({
  loading,
  actualView,
  count,
  tasks,
  selectedRowKeys,
  openConformationDialog
});

export const mapLabelingTasksParams = ({
  page,
  rowsPerPage,
  searchProps,
  filterStatus,
  sortOrder,
  sortField
}: ITableStateProps): IMappedTableParams => {
  return {
    page,
    page_size: rowsPerPage,
    status: filterStatus,
    ordering: sortOrder === 'ascend' ? sortField : `-${sortField}`,
    ...searchProps
  };
};

export const getLabelingTasks = createAsyncThunk(
  'taskStatuses/fetchLabelingTask',
  compose<ITableStateProps, IMappedTableParams, ILabelingTasksResponse>(getLabelingTasksRequest)(mapLabelingTasksParams)
);

export const archiveLabelingTask = createAsyncThunk('taskStatuses/archiveLabelingTask', (_, { getState }) => {
  const { tasksStatuses } = getState() as TAppState;
  return archiveTaskLabelingRequest(tasksStatuses.selectedRowKeys);
});

export const retryLabelingTask = createAsyncThunk('taskStatuses/retryLabelingTask', (_, { getState }) => {
  const { tasksStatuses } = getState() as TAppState;
  return retryLabelingTaskRequest(tasksStatuses.selectedRowKeys);
});

const tasksStatusesSlice = createSlice({
  name: 'taskStatuses',
  initialState: getStatusesState(),
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
        state.tasks = action.payload.results;
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
