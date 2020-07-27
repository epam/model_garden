import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GalleryState } from './types';
import { getLabelingTasksRequest } from '../../api';
import { AppState } from '..';
import { Dataset } from '../../models';
import { getMediaAssetsRequest } from '../../api/gallery.api';

export const getMediaAssets = createAsyncThunk('fetchMediaAssets', async ({ datasetId }: any, { getState }) => {
  const { data } = getState() as AppState;
  const bucketId = data.datasets.find((dataset: Dataset) => dataset.id === datasetId)?.bucket; //@todo: update once we change arrays to object
  const response = await getMediaAssetsRequest({ datasetId, bucketId });
  return response.data.results;
});

export const getDatasetsTasks = createAsyncThunk('getDatasetsTasks', async (params: Object) => {
  const response = await getLabelingTasksRequest(params);
  return response.tasks;
});

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    mediaAssets: [],
    tasks: []
  } as GalleryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMediaAssets.fulfilled, (state, action) => {
        state.mediaAssets = action.payload;
      })
      .addCase(getDatasetsTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });
  }
});

export const galleryReducer = gallerySlice.reducer;
