import { createSlice, PayloadAction, AnyAction } from '@reduxjs/toolkit';
import { IUiState } from './types';
import { uploadMediaFiles, addExistingDataset } from '../media';
import { getMediaAssets } from '../gallery';
import { createLabelingTask } from '../labelingTask';
import { dataInit, removeDataset } from '../data';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showLoader: false // Used to show (or not) the ProgressLoader's spinner based on the action status.
  } as IUiState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action: AnyAction): action is PayloadAction<{}> => {
          return [
            addExistingDataset,
            getMediaAssets,
            uploadMediaFiles,
            createLabelingTask,
            dataInit,
            removeDataset
          ].some((thunk) => thunk.pending.match(action));
        },
        (state) => {
          state.showLoader = true;
        }
      )
      .addMatcher(
        (action: AnyAction): action is PayloadAction<{}> => action.type.endsWith('fulfilled'),
        (state) => {
          state.showLoader = false;
        }
      )
      .addMatcher(
        (action: AnyAction): action is PayloadAction<{}> => action.type.endsWith('rejected'),
        (state) => {
          state.showLoader = false;
        }
      );
  }
});

export const uiReducer = uiSlice.reducer;
