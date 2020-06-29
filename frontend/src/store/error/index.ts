import { createSlice } from '@reduxjs/toolkit';
import { getBuckets } from '../data';

const initialState: string = '';

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    clearError: () => '',
    setErrorAction: (_, action) => action.payload?.message || 'Network Error'
  },
  extraReducers: (builder) => {
    builder.addCase(getBuckets.rejected, (_, { error }) => error.message || 'Network Error');
  }
});

export const errorReducer = errorSlice.reducer;
export const { clearError, setErrorAction } = errorSlice.actions;
