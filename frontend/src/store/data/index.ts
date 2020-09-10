import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { IDataState } from './types';
import { IDataset } from '../../models';
import { getBucketsRequest, getDatasetsRequest, getLabelingToolUsersRequest } from '../../api';

export const getBuckets = createAsyncThunk('fetchBuckets', async () => {
  const response = await getBucketsRequest();
  return response.data.results.map((item: any) => ({ ...item, id: `${item.id}` }));
});

export const getDatasets = createAsyncThunk('data/fetchDatasets', async (bucketId: string) => {
  const response = await getDatasetsRequest(bucketId);
  return [...response.data.results]
    .sort((a: IDataset, b: IDataset) => (a.path > b.path ? 1 : -1))
    .map((dataset) => ({
      ...dataset,
      id: `${dataset.id}`,
      path: `${dataset.path.split('')[0] === '/' ? '' : '/'}${dataset.path}`
    }));
});

export const getLabelingToolUsers = createAsyncThunk('fetchUsers', async () => {
  const response = await getLabelingToolUsersRequest();
  return response.data;
});

export const dataInit = createAsyncThunk('data/init', async () => {
  //special thunk that loads buckets and users in one action
  //this models the action as 'an event' instead of a getter
  const [bucketsResponse, usersResponse] = await Promise.allSettled([
    getBucketsRequest(),
    getLabelingToolUsersRequest()
  ]);

  if (usersResponse.status === 'rejected') {
    toast.error(usersResponse.reason.message, { autoClose: false });
  }
  if (bucketsResponse.status === 'rejected') {
    toast.error(bucketsResponse.reason.message || 'Error fetching Buckets', { autoClose: false });
  }

  return {
    buckets: (bucketsResponse as any).value?.data.results.map((item: any) => ({ ...item, id: `${item.id}` })) ?? [],
    labelingToolUsers: (usersResponse as any).value?.data ?? []
  };
});
const dataSlice = createSlice({
  name: 'data',
  initialState: {
    buckets: [], // list of buckets that populates the dropdown field.
    datasets: [], // datasets field to display datasetCard.
    labelingToolUsers: [] // list of users to populate dropdown , used in dataset and gallery modal.
  } as IDataState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBuckets.fulfilled, (state, { payload }) => {
        state.buckets = payload;
      })
      .addCase(getDatasets.fulfilled, (state, { payload }) => {
        state.datasets = payload;
      })
      .addCase(getLabelingToolUsers.fulfilled, (state, { payload }) => {
        state.labelingToolUsers = payload;
      })
      .addCase(dataInit.fulfilled, (state, { payload }) => {
        state.buckets = payload.buckets;
        state.labelingToolUsers = payload.labelingToolUsers;
      });
  }
});

export const dataReducer = dataSlice.reducer;
