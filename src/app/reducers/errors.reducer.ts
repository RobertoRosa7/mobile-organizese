/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/errors.actions';

const INITIAL_STATES = {
  error: {},
  success: '',
};

const errorsReducers = createReducer(
  INITIAL_STATES,
  on(actions.SET_ERRORS, (states, { payload }) => setErrors(states, payload)),
  on(actions.SET_SUCCESS, (states, { payload }) => setSuccess(states, payload)),
  on(actions.RESET_ERRORS, (states) => resetErrors(states))
);

const setSuccess = (states, payload) => ({
  ...states,
  success: payload,
});
const setErrors = (states, payload) => ({
  ...states,
  error: payload,
});
const resetErrors = (states) => ({
  ...states,
  error: {},
  success: '',
});

export const reducerErrors = (state: any, action: any): any =>
  errorsReducers(state, action);
