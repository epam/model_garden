import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GalleryState } from './types';
import { getLabelingTasksRequest } from '../../api';

export const getDatasetsTasks = createAsyncThunk('getDatasetsTasks', async (params: Object) => {
  const response = await getLabelingTasksRequest(params);
  return response;
});

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    tasks: []
  } as GalleryState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDatasetsTasks.fulfilled, (state, action) => {
      state.tasks = action.payload.tasks;
    });
  }
});

export const galleryReducer = gallerySlice.reducer;
