import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { ILabelingTaskRequestData } from '../../models';
import { createLabelingTaskRequest, getUnsignedImagesCountRequest } from '../../api';
import { Notification } from '../../components/tasksStatuses/createTaskDialog/notification';

interface ILabelingTasksState {
  unsignedImagesCount: number; // Number of images in the dataset without task
  openCreateTaskDialog: boolean; // Boolean state of the Create Task Dialog Form
}

const getTasksState = (
  unsignedImagesCount: number = 0,
  openCreateTaskDialog: boolean = false
): ILabelingTasksState => ({
  unsignedImagesCount,
  openCreateTaskDialog
});

export const getUnsignedImagesCount = createAsyncThunk('fetchUnsignedImagesCount', getUnsignedImagesCountRequest);

export const createLabelingTask = createAsyncThunk('createLabelingTask', async (taskData: any) => {
  const params: ILabelingTaskRequestData = {
    task_name: taskData.taskName,
    dataset_id: taskData.currentDatasetId,
    assignee_id: taskData.user,
    files_in_task: taskData.filesInTask,
    count_of_tasks: taskData.countOfTasks
  };
  const { headers } = await createLabelingTaskRequest(params);
  return headers.location;
});

const labelingTaskSlice = createSlice({
  name: 'labelingTask',
  initialState: getTasksState(),
  reducers: {
    clearUnsignedImagesCount(state) {
      state.unsignedImagesCount = 0;
    },
    setOpenCreateTaskDialog: (state, { payload }) => {
      state.openCreateTaskDialog = payload;
    }
  },
  extraReducers: (builder) =>
    builder
      .addCase(getUnsignedImagesCount.fulfilled, (state, action) => {
        state.unsignedImagesCount = action.payload.count;
      })
      .addCase(createLabelingTask.fulfilled, (_, action) => {
        toast.success(Notification(action.payload), { autoClose: 6000 });
      })
});

export const labelingTaskReducer = labelingTaskSlice.reducer;
export const { clearUnsignedImagesCount, setOpenCreateTaskDialog } = labelingTaskSlice.actions;
