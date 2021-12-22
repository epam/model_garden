import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mapLabelingTasksParams } from '../tasksStatuses';
import { getLabelingTasksRequest } from '../../api';
import { getDatasets } from '../data';
import { getMediaAssetsRequest } from '../../api/gallery.api';
import {
  ITableStateProps,
  IMappedTableParams,
  ILabelingTaskStatus,
  IMediaAssets,
  ILabelingTasksResponse
} from '../../models';
import { compose } from '../../utils';

interface IGalleryState {
  mediaAssets: IMediaAssets[]; // Stores media, for now only images related to the datasets.
  tasks: ILabelingTaskStatus[]; // Used to store labeled task info. Used in gallery and DataSets.
}

const getStateGalleryState = (mediaAssets: IMediaAssets[] = [], tasks: ILabelingTaskStatus[] = []): IGalleryState => ({
  mediaAssets,
  tasks
});

export const getMediaAssets = createAsyncThunk('fetchMediaAssets', getMediaAssetsRequest);

export const getDatasetsTasks = createAsyncThunk(
  'getDatasetsTasks',
  compose<ITableStateProps, IMappedTableParams, ILabelingTasksResponse>(getLabelingTasksRequest)(mapLabelingTasksParams)
);

// TODO: use getMediaAssets and getDatasetsTasks instead
export const imageGalleryInit = createAsyncThunk(
  'gallery/init',
  async ({ bucketId, datasetId }: any, { getState, dispatch }) => {
    let state = getState() as any;
    if (!state.data.datasets.length) {
      await dispatch(getDatasets(bucketId));
      state = getState() as any;
    }
    const [assetsResponse, tasksResponse] = await Promise.all([
      getMediaAssetsRequest({ datasetId }),
      getLabelingTasksRequest({ dataset_id: datasetId })
    ]);

    return getStateGalleryState(assetsResponse.results, tasksResponse.results);
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState: getStateGalleryState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMediaAssets.fulfilled, (state, action) => {
        state.mediaAssets = action.payload.results;
      })
      .addCase(getDatasetsTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.results;
      })
      .addCase(imageGalleryInit.fulfilled, (state, { payload }: any) => {
        state.mediaAssets = payload.mediaAssets;
        state.tasks = payload.tasks;
      });
  }
});

export const galleryReducer = gallerySlice.reducer;
