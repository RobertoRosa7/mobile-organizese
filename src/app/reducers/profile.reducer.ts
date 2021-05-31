import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/profile.actions';
import * as actionsApp from '../actions/app.actions';

const INITIAL_STATES = {
  profile: {},
};

const profileReducer = createReducer(
  INITIAL_STATES,
  on(actions.SET_PROFILE, (states, { payload }) => ({
    ...states,
    profile: payload,
  })),
  on(actionsApp.resetall, (states) => ({ ...states, profile: {} }))
);

export const reducerProfile = (state: any, action: any) =>
  profileReducer(state, action);
