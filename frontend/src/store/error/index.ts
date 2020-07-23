import { createSlice } from '@reduxjs/toolkit';
import { getBuckets, getLabelingToolUsers } from '../data';
import { getLabelingTasks, archiveLabelingTask, retryLabelingTask } from '../tasksStatuses';

const helper = (defaultText: string) => (_: any, { error }: any) => error.message || defaultText;

export const errorSlice = createSlice({
  name: 'error',
  initialState: '' as string,
  reducers: {
    clearError: () => '',
    setErrorAction: (_, action) => action.payload?.message || 'Network Error' // try not to use. Instead, populate error in response to failed request
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBuckets.rejected, helper('Error getting Buckets'))
      .addCase(getLabelingToolUsers.rejected, helper('Error Getting Users'))
      .addCase(getLabelingTasks.rejected, helper('Error getting labeling tasks'))
      .addCase(archiveLabelingTask.rejected, helper('Error archiving task(s)'))
      .addCase(retryLabelingTask.rejected, helper('Error retrying labeling task(s)'));
  }
});

export const errorReducer = errorSlice.reducer;
export const { clearError, setErrorAction } = errorSlice.actions;
