import { createSlice } from '@reduxjs/toolkit';
import { getBuckets, getLabelingToolUsers } from '../data';

const initialState: string = '';

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    clearError: () => '',
    setErrorAction: (_, action) => action.payload?.message || 'Network Error'
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBuckets.rejected, (_, { error }) => error.message || 'Network Error')
      .addCase(getLabelingToolUsers.rejected, () => 'Error Getting Users');
  }
});

export const errorReducer = errorSlice.reducer;
export const { clearError, setErrorAction } = errorSlice.actions;
