import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IGalleryState } from './types';
import { getLabelingTasksRequest } from '../../api';
import { getDatasets } from '../data';

import { getMediaAssetsRequest } from '../../api/gallery.api';

export const getMediaAssets = createAsyncThunk('fetchMediaAssets', async ({ datasetId }: any) => {
  const response = await getMediaAssetsRequest({ datasetId });
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
    let [mediaAssetsResponse, tasksResponse] = await Promise.all([
      getMediaAssetsRequest({ datasetId }),
      getLabelingTasksRequest({ dataset_id: datasetId })
    ]);

    return { mediaAssets: mediaAssetsResponse.data.results, tasks: tasksResponse.tasks };
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: {
    mediaAssets: [], // Stores media, for now only images related to the datasets.
    tasks: [] // Used to store labeled task info. Used in gallery and DataSets.
  } as IGalleryState,
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
