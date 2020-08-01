import { createSlice } from '@reduxjs/toolkit';
import { getBuckets, getLabelingToolUsers } from '../data';
import { getLabelingTasks, archiveLabelingTask, retryLabelingTask } from '../tasksStatuses';
import { toast } from 'react-toastify';
import { createLabelingTask } from '../labelingTask';
import { uploadMediaFiles, addExistingDataset } from '../media';

const helper = (defaultText: string) => (_: any, { error }: any) => error.message || defaultText;
const helperToast = (defaultText: string, autoClose: any) => (_: any, { error }: any) => {
  toast.error(error.message || defaultText, { autoClose });
  return '';
};

export const errorSlice = createSlice({
  name: 'error',
  initialState: '' as string,
  reducers: {
    clearError: () => '',
    setErrorAction: (_, action) => action.payload?.message || 'Network Error' // try not to use. Instead, populate error in response to failed request
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBuckets.rejected, helperToast('Error Getting Users', 4000))
      .addCase(getLabelingToolUsers.rejected, helperToast('Error Getting Users', false))
      .addCase(getLabelingTasks.rejected, helperToast('Error getting labeling tasks', 4000))
      .addCase(archiveLabelingTask.rejected, helperToast('Error archiving task(s)', 4000))
      .addCase(retryLabelingTask.rejected, helperToast('Error retrying labeling task(s)', 4000))
      .addCase(uploadMediaFiles.rejected, helperToast('Error uploading Images', 4000))
      .addCase(addExistingDataset.rejected, helperToast('Error adding ExistingDataset', 4000))
      .addCase(createLabelingTask.rejected, helperToast('Failed to create labeling task', 4000));
  }
});

export const errorReducer = errorSlice.reducer;
export const { clearError, setErrorAction } = errorSlice.actions;
