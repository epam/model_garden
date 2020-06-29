import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataState } from './types';
import { Dataset } from '../../models';
import { getBucketsRequest, getDatasetsRequest, getMediaAssetsRequest } from '../../api';

export const initialState: DataState = {
  buckets: [],
  datasets: [],
  mediaAssets: []
};

export const getBuckets = createAsyncThunk('fetchBuckets', async () => {
  const response = await getBucketsRequest();
  return response.data.results;
});

export const getDatasets = createAsyncThunk('fetchDatasets', async (bucketId: string) => {
  const response = await getDatasetsRequest(bucketId);
  return [...response.data.results]
    .sort((a: Dataset, b: Dataset) => (a.path > b.path ? 1 : -1))
    .map((dataset) => ({
      ...dataset,
      path: `${dataset.path.split('')[0] === '/' ? '' : '/'}${dataset.path}`
    }));
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
      .addCase(getBuckets.fulfilled, (state, action) => {
        state.buckets = action.payload;
      })
      .addCase(getDatasets.fulfilled, (state, action) => {
        state.datasets = action.payload;
      })
      .addCase(getMediaAssets.fulfilled, (state, action) => {
        state.mediaAssets = action.payload;
      });
  }
});

export const dataReducer = dataSlice.reducer;
