import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LabelingToolUser, LabelingTaskRequestData } from '../../models';
import { createLabelingTaskRequest, getLabelingToolUsersRequest, getUnsignedImagesCountRequest } from '../../api';

export interface LabelingTasksState {
  newTaskUrl: string;
  labelingToolUsers: LabelingToolUser[];
  unsignedImagesCount: number;
}

export const initialState: LabelingTasksState = {
  newTaskUrl: '',
  labelingToolUsers: [],
  unsignedImagesCount: 0
};

export const getLabelingToolUsers = createAsyncThunk('fetchUsers', async () => {
  const response = await getLabelingToolUsersRequest();
  return response.data;
});

export const getUnsignedImagesCount = createAsyncThunk('fetchUnsignedImagesCount', async (datasetId: string) => {
  const response = await getUnsignedImagesCountRequest(datasetId);
  return response.data.count;
});

export const createLabelingTask = createAsyncThunk('createLabelingTask', async (taskData: any) => {
  const params: LabelingTaskRequestData = {
    task_name: taskData.taskName,
    dataset_id: taskData.currentDatasetId,
    assignee_id: taskData.user,
    files_in_task: taskData.filesInTask,
    count_of_tasks: taskData.countOfTasks
  };
  const response = await createLabelingTaskRequest(params);
  return response.headers['location'];
});

const labelingTaskSlice = createSlice({
  name: 'labelingTask',
  initialState,
  reducers: {
    clearUnsignedImagesCount(state) {
      state.unsignedImagesCount = 0;
    },
    clearTaskUrl(state) {
      state.newTaskUrl = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLabelingToolUsers.fulfilled, (state, action) => {
        state.labelingToolUsers = action.payload;
      })
      .addCase(getUnsignedImagesCount.fulfilled, (state, action) => {
        state.unsignedImagesCount = action.payload;
      })
      .addCase(createLabelingTask.fulfilled, (state, action) => {
        state.newTaskUrl = action.payload;
      });
  }
});

export const labelingTaskReducer = labelingTaskSlice.reducer;
export const { clearUnsignedImagesCount, clearTaskUrl } = labelingTaskSlice.actions;
