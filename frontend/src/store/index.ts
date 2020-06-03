import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { useDispatch } from 'react-redux';
import { errorReducer } from './error';
import { mainReducer } from './main';
import { mediaReducer } from './media';
import { labelingTaskReducer } from './labelingTask';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import * as api from '../api';

const reducer = {
  error: errorReducer,
  main: mainReducer,
  media: mediaReducer,
  labelingTask: labelingTaskReducer
};

const middleware = getDefaultMiddleware({
  thunk: { extraArgument: { ...api } },
  immutableCheck: false,
  serializableCheck: false
});

const devTools = process.env.NODE_ENV !== 'production';

const store = configureStore({
  reducer,
  middleware,
  devTools
});

export type AppState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types

export default store;
