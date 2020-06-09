import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SET_CURRENT_DATASET_ID } from '../labelingTask/types';
import { UploadFiles, AddExistingDataset, initialState } from './types';

//async Thunks
export const uploadMediaFiles = createAsyncThunk(
  'media/uploadMediaFile',
  async ({ files, bucketId, path }: UploadFiles, { extra: { uploadMediaFilesRequest } }: any) => {
    const response = await uploadMediaFilesRequest(files, bucketId, path);
    return response.data;
  }
);
export const getMediaImages = createAsyncThunk(
  'media/fetchImages',
  async (params: any, { extra: { getImages } }: any) => {
    const response = await getImages(params);
    return response.data.results;
  }
);
export const addExistingDataset = createAsyncThunk(
  'media/addExistingDataset',
  async ({ bucketId, path }: AddExistingDataset, { extra: { addExistingDatasetRequest } }: any) => {
    const request = await addExistingDatasetRequest(bucketId, path);
    return request.data.imported;
  }
);

//actions and reducer
const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    //non-thunk reducer
    setMediaFiles: (state: any, action: any) => {
      state.mediaFiles = action.payload;
    }
  },
  extraReducers: (builder) => {
    //reducer for async actions
    builder
      .addCase(uploadMediaFiles.fulfilled, (state, action) => {
        state = action.payload;
      })
      .addCase(getMediaImages.fulfilled, (state, action) => {
        state.photos = action.payload;
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
export const { setMediaFiles } = mediaSlice.actions;
