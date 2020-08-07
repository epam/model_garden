import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { UploadFiles, AddExistingDataset, MediaState } from './types';
import { uploadMediaFilesRequest, addExistingDatasetRequest } from '../../api';

//async Thunks
export const uploadMediaFiles = createAsyncThunk(
  'media/uploadMediaFiles',
  async ({ files, bucketId, path, format }: UploadFiles) => {
    const response = await uploadMediaFilesRequest(files, bucketId, path, format);
    return response.data;
  }
);

export const addExistingDataset = createAsyncThunk(
  'media/addExistingDataset',
  async ({ bucketId, path, format }: AddExistingDataset) => {
    const request = await addExistingDatasetRequest(bucketId, path, format);
    return request.data.imported;
  }
);

//actions and reducer
const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    addedMediaAssets: undefined, // not really needed right now
    batchName: '' // unused
  } as MediaState,
  reducers: {},
  extraReducers: (builder) => {
    //reducer for async actions
    builder
      .addCase(uploadMediaFiles.fulfilled, (_, { payload }) => {
        toast.success(payload.message);
      })
      .addCase(addExistingDataset.fulfilled, (state, action) => {
        state.addedMediaAssets = action.payload;
        toast.success('Dataset has been added');
      });
  }
});

export const mediaReducer = mediaSlice.reducer;
