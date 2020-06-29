import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SET_CURRENT_DATASET_ID } from '../labelingTask/types';
import { UploadFiles, AddExistingDataset, initialState } from './types';
import { uploadMediaFilesRequest, addExistingDatasetRequest } from '../../api';

//async Thunks
export const uploadMediaFiles = createAsyncThunk(
  'media/uploadMediaFile',
  async ({ files, bucketId, path }: UploadFiles) => {
    const response = await uploadMediaFilesRequest(files, bucketId, path);
    return response.data;
  }
);

export const addExistingDataset = createAsyncThunk(
  'media/addExistingDataset',
  async ({ bucketId, path }: AddExistingDataset) => {
    const request = await addExistingDatasetRequest(bucketId, path);
    return request.data.imported;
  }
);

//actions and reducer
const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //reducer for async actions
    builder
      .addCase(uploadMediaFiles.fulfilled, (state, action) => {
        state = action.payload;
      })
      .addCase(addExistingDataset.pending, (state) => {
        state.addingExistingDataSet = true;
      })
      .addCase(addExistingDataset.fulfilled, (state, action) => {
        state.addingExistingDataSet = false;
        state.addedMediaAssets = action.payload;
      })
      .addCase(SET_CURRENT_DATASET_ID, (state) => {
        state.photos = [];
      });
  }
});

export const mediaReducer = mediaSlice.reducer;
