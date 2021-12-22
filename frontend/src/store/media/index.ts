import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { IMediaState } from './types';
import { uploadMediaFilesRequest, addExistingDatasetRequest } from '../../api';

export const uploadMediaFiles = createAsyncThunk('media/uploadMediaFiles', uploadMediaFilesRequest);

export const addExistingDataset = createAsyncThunk('media/addExistingDataset', addExistingDatasetRequest);

const initialState: IMediaState = {
  imported: 0,
  batchName: ''
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadMediaFiles.fulfilled, (_, { payload }) => {
        toast.success(payload.message);
      })
      .addCase(addExistingDataset.fulfilled, (state, { payload }) => {
        state.imported = payload.imported;
        toast.success('Dataset has been added');
      });
  }
});

export const mediaReducer = mediaSlice.reducer;
