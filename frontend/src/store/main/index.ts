import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MainState } from './types';
import { getBucketsRequest } from '../../api';

export const initialState: MainState = {
  isBucketsLoading: false,
  buckets: []
};

export const getBuckets = createAsyncThunk('fetchBuckets', async () => {
  const response = await getBucketsRequest();
  return response.data.results;
});

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBuckets.pending, (state) => {
        state.isBucketsLoading = true;
      })
      .addCase(getBuckets.fulfilled, (state, action) => {
        state.isBucketsLoading = false;
        state.buckets = action.payload;
      });
  }
});

export const mainReducer = mainSlice.reducer;
