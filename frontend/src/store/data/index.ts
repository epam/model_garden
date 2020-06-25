import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataState } from './types';
import { getBucketsRequest, getDatasetsRequest, getMediaAssetsRequest } from '../../api';

export const initialState: DataState = {
  buckets: [],
  datasets: [],
  labelingTasks: [],
  mediaAssets: []
};

export const getBuckets = createAsyncThunk('fetchBuckets', async () => {
  const response = await getBucketsRequest();
  return response.data.results;
});

export const getDatasets = createAsyncThunk('fetchDatasets', async (bucketId: string) => {
  const response = await getDatasetsRequest(bucketId);
  return response.data.results;
  // const results: results = {};
  // for (item in response.data.results) {
  //   results[response.data.results[item].id] = {
  //     ...response.data.results[item]
  //   };
  // }
});

export const getMediaAssets = createAsyncThunk('fetchMediaAssets', async (params: any) => {
  const response = await getMediaAssetsRequest(params);
  return response.data.results;
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBuckets.pending, (state) => {
        // state.isBucketsLoading = true;
      })
      .addCase(getBuckets.fulfilled, (state, action) => {
        // state.isBucketsLoading = false;
        state.buckets = action.payload;
      })
      .addCase(getDatasets.pending, (state) => {
        // state.isDatasetsLoading = true;
      })
      .addCase(getDatasets.fulfilled, (state, action) => {
        // state.isDatasetsLoading = false;
        state.datasets = action.payload;
      })
      .addCase(getMediaAssets.pending, (state) => {
        // state.isMediaAssetsLoading = true;
      })
      .addCase(getMediaAssets.fulfilled, (state, action) => {
        // state.isMediaAssetsLoading = false;
        state.mediaAssets = action.payload;
      });
  }
});

export const dataReducer = dataSlice.reducer;
