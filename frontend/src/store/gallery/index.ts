import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GalleryState } from './types';
import { getLabelingTasksRequest } from '../../api';
import { getDatasets } from '../data';

import { getMediaAssetsRequest } from '../../api/gallery.api';

import { Dataset } from '../../models';

export const getMediaAssets = createAsyncThunk('fetchMediaAssets', async ({ bucketId, datasetId }: any) => {
  const response = await getMediaAssetsRequest({ datasetId, bucketId });
  return response.data.results;
});

export const getDatasetsTasks = createAsyncThunk('getDatasetsTasks', async ({ dataset }: any) => {
  const response = await getLabelingTasksRequest({ dataset });
  return response.tasks;
});

export const imageGalleryInit = createAsyncThunk(
  'gallery/init',
  async ({ bucketId, datasetId }: any, { getState, dispatch }) => {
    let state = getState() as any;
    if (!state.data.datasets.length) {
      await dispatch(getDatasets(bucketId));
      state = getState() as any;
    }
    const datasets = state.data.datasets;
    const datasetPath = datasets.find((dataset: Dataset) => dataset.id === datasetId).path;
    let [mediaAssetsResponse, tasksResponse] = await Promise.all([
      getMediaAssetsRequest({ datasetId, bucketId }),
      //@todo : update once we will have API request by dataset Id
      getLabelingTasksRequest({ dataset: datasetPath })
    ]);

    return { mediaAssets: mediaAssetsResponse.data.results, tasks: tasksResponse.tasks };
  }
);

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
      })
      .addCase(imageGalleryInit.fulfilled, (state, { payload }: any) => {
        state.mediaAssets = payload.mediaAssets;
        state.tasks = payload.tasks;
      });
  }
});

export const galleryReducer = gallerySlice.reducer;
