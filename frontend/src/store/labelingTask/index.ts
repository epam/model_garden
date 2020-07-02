import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LabelingTaskRequestData } from '../../models';
import { createLabelingTaskRequest, getUnsignedImagesCountRequest } from '../../api';

export interface LabelingTasksState {
  newTaskUrl: string;
  unsignedImagesCount: number;
}

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
  initialState: {
    newTaskUrl: '',
    unsignedImagesCount: 0
  } as LabelingTasksState,
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
