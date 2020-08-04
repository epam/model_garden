import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { LabelingTaskRequestData } from '../../models';
import { createLabelingTaskRequest, getUnsignedImagesCountRequest } from '../../api';
import { Notification } from '../../components/labelingTask/notification';

export interface LabelingTasksState {
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
  const { headers } = await createLabelingTaskRequest(params);
  return headers['location'];
});

const labelingTaskSlice = createSlice({
  name: 'labelingTask',
  initialState: {
    unsignedImagesCount: 0
  } as LabelingTasksState,
  reducers: {
    clearUnsignedImagesCount(state) {
      state.unsignedImagesCount = 0;
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(getUnsignedImagesCount.fulfilled, (state, action) => {
        state.unsignedImagesCount = action.payload;
      })
      .addCase(createLabelingTask.fulfilled, (_, action) => {
        toast.success(Notification(action.payload), { autoClose: 6000 });
      })
});

export const labelingTaskReducer = labelingTaskSlice.reducer;
export const { clearUnsignedImagesCount } = labelingTaskSlice.actions;
