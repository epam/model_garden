import { createSlice } from '@reduxjs/toolkit';
import { UiState } from './types';
import { uploadMediaFiles, addExistingDataset } from '../media';
import { getMediaAssets } from '../gallery';
import { createLabelingTask } from '../labelingTask';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showLoader: false
  } as UiState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMediaAssets.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(getMediaAssets.fulfilled, (state) => {
        state.showLoader = false;
      })
      .addCase(addExistingDataset.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(addExistingDataset.fulfilled, (state) => {
        state.showLoader = false;
      })
      .addCase(uploadMediaFiles.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(uploadMediaFiles.fulfilled, (state) => {
        state.showLoader = false;
      })
      .addCase(createLabelingTask.pending, (state) => {
        state.showLoader = true;
      })
      .addCase(createLabelingTask.fulfilled, (state) => {
        state.showLoader = false;
      });
  }
});

export const uiReducer = uiSlice.reducer;
