import { createStore, compose, applyMiddleware, Action, combineReducers } from 'redux';
import thunk, { ThunkAction } from 'redux-thunk';
import { authReducer, AuthState } from './auth';

export interface AppState {
  auth: AuthState;
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
  auth: authReducer
});

const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, null, Action<string>>;

export default store;
