import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { errorReducer } from './error';
import { dataReducer } from './data';
import { mediaReducer } from './media';
import { labelingTaskReducer } from './labelingTask';
import { configureStore } from '@reduxjs/toolkit';
import { tasksStatusesReducer } from './tasksStatuses';

const store = configureStore({
  reducer: {
    error: errorReducer,
    data: dataReducer,
    media: mediaReducer,
    labelingTask: labelingTaskReducer,
    tasksStatuses: tasksStatusesReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type AppState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
export const useTypedSelector: TypedUseSelectorHook<AppState> = useSelector;

export default store;
