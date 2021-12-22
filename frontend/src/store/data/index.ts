import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { compose, addSlashIfAbsentInField, stringifyField } from '../../utils';
import { IDataset, IBucket, LabelingToolUser } from '../../models';
import { getBucketsRequest, getDatasetsRequest, getLabelingToolUsersRequest, deleteDatasetRequest } from '../../api';

interface IDataState {
  buckets: IBucket[];
  datasets: IDataset[];
  labelingToolUsers: LabelingToolUser[];
}

const getDataState = (
  buckets: IBucket[] = [],
  datasets: IDataset[] = [],
  labelingToolUsers: LabelingToolUser[] = []
): IDataState => ({
  buckets,
  datasets,
  labelingToolUsers
});

export const getBuckets = createAsyncThunk('fetchBuckets', async () => {
  const response = await getBucketsRequest();
  return response.results.map(stringifyField('id'));
});

export const getDatasets = createAsyncThunk('data/fetchDatasets', async (bucketId: string) => {
  const data = await getDatasetsRequest(bucketId);
  return data.results
    .sort((a, b) => (a.path > b.path ? 1 : -1))
    .map(compose<IDataset>(stringifyField('id'))(addSlashIfAbsentInField('path')));
});

export const getLabelingToolUsers = createAsyncThunk('fetchUsers', getLabelingToolUsersRequest);

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

  return getDataState(
    (bucketsResponse as any).value?.results.map(stringifyField('id')) ?? [],
    [],
    (usersResponse as any).value || []
  );
});

export const removeDataset = createAsyncThunk('data/removeDataset', deleteDatasetRequest);

const dataSlice = createSlice({
  name: 'data',
  initialState: getDataState(),
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
      })
      .addCase(removeDataset.fulfilled, () => {
        toast.success('Dataset has been deleted', { autoClose: 6000 });
      })
      .addCase(removeDataset.rejected, (state, { error }) => {
        // TODO: check error.message nesting. Does "Action" have "error" field?
        // Probably it should be: payload.message | payload.error.message?
        toast.error(`Error: ${error.message || 'Something went wrong, Dataset NOT Deleted.'}`, { autoClose: 4000 });
      });
  }
});

export const dataReducer = dataSlice.reducer;
