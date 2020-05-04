import { createStore, compose, applyMiddleware, Action, combineReducers } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
import { errorReducer, ErrorState } from './error';
import { mainReducer, MainState } from './main';
import { mediaReducer, MediaState } from './media';
import { labelingTaskReducer, LabelingTasksState } from './labelingTask';

export interface AppState {
  error: ErrorState;
  main: MainState;
  media: MediaState;
  labelingTask: LabelingTasksState;
}

// property should be declared to soothe typescript struggles
// @see https://stackoverflow.com/questions/52800877/has-anyone-came-across-this-error-in-ts-with-redux-dev-tools-property-redux
// @see https://stackoverflow.com/questions/12709074/how-do-you-explicitly-set-a-new-property-on-window-in-typescript
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers<AppState>({
  error: errorReducer,
  main: mainReducer,
  media: mediaReducer,
  labelingTask: labelingTaskReducer,
});

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, null, Action<string>>;

export default store;
