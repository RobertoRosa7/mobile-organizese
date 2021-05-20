/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { createAction, props } from '@ngrx/store';

export enum actionsTypes {
  SET_ERRORS = '[SET_ERRORS]',
  SET_SUCCESS = '[SET_SUCCESS]',
  SET_STATUS_CODE = '[SET_STATUS_CODE]',
  GET_STATUS_CODE = '[GET_STATUS_CODE]',
  RESET_ERRORS = '[RESET_ERRORS]',
}

export enum SourceErrors {
  INIT_DASHBOARD = '[INIT_DASHBOARD]',
}

export const SET_ERRORS = createAction(
  actionsTypes.SET_ERRORS,
  props<{ payload: any }>()
);
export const SET_SUCCESS = createAction(
  actionsTypes.SET_SUCCESS,
  props<{ payload: any }>()
);
export const GET_STATUS_CODE = createAction(actionsTypes.GET_STATUS_CODE);
export const SET_STATUS_CODE = createAction(
  actionsTypes.SET_STATUS_CODE,
  props<{ payload: any }>()
);
export const RESET_ERRORS = createAction(actionsTypes.RESET_ERRORS);
