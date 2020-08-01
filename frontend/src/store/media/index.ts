import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
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
        toast.success(action.payload.message);
      })
      .addCase(addExistingDataset.pending, (state) => {
        state.addingExistingDataSet = true;
        toast.success('Dataset has been added');
      })
      .addCase(addExistingDataset.fulfilled, (state, action) => {
        state.addingExistingDataSet = false;
        state.addedMediaAssets = action.payload;
      });
  }
});

export const mediaReducer = mediaSlice.reducer;
