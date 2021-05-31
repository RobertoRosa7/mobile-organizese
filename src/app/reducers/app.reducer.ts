import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/app.actions';

const INITIAL_STATES = {
  online: {},
  hidevalues: false,
};

const appReducer = createReducer(
  INITIAL_STATES,
  on(actions.setonline, (states, { payload }) => ({
    ...states,
    online: payload,
  })),
  on(actions.PUT_HIDE_VALUES, (states, { payload }) => ({
    ...states,
    hidevalues: payload,
  })),
  on(actions.resetall, (states) => ({ ...states, online: false }))
);

export const reducerApp = (state: any, action: any) =>
  appReducer(state, action);
