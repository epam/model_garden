import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DataState } from './types';
import { Dataset } from '../../models';
import { getBucketsRequest, getDatasetsRequest, getLabelingToolUsersRequest } from '../../api';

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

export const getLabelingToolUsers = createAsyncThunk('fetchUsers', async () => {
  const response = await getLabelingToolUsersRequest();
  return response.data;
});

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    buckets: [],
    datasets: [],
    labelingToolUsers: []
  } as DataState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBuckets.fulfilled, (state, action) => {
        state.buckets = action.payload;
      })
      .addCase(getDatasets.fulfilled, (state, action) => {
        state.datasets = action.payload;
      })
      .addCase(getLabelingToolUsers.fulfilled, (state, action) => {
        state.labelingToolUsers = action.payload;
      });
  }
});

export const dataReducer = dataSlice.reducer;
