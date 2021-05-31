/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { createAction, props } from '@ngrx/store';

export enum ActionsTypes {
  online = '[online]',
  setOnline = '[setOnline]',
  resetAll = '[resetAll]',
  hideValues = '[hideValues]',

  GET_HIDE_VALUES = '[GET_HIDE_VALUES]',
  SET_HIDE_VALUES = '[SET_HIDE_VALUES]',
  PUT_HIDE_VALUES = '[PUT_HIDE_VALUES]',
}

export const onLine = createAction(ActionsTypes.online);
export const GET_HIDE_VALUES = createAction(ActionsTypes.GET_HIDE_VALUES);

export const setonline = createAction(
  ActionsTypes.setOnline,
  props<{ payload: any }>()
);

export const hidevalues = createAction(
  ActionsTypes.hideValues,
  props<{ payload: any }>()
);

export const SET_HIDE_VALUES = createAction(
  ActionsTypes.SET_HIDE_VALUES,
  props<{ payload: any }>()
);

export const PUT_HIDE_VALUES = createAction(
  ActionsTypes.PUT_HIDE_VALUES,
  props<{ payload: any }>()
);

export const resetall = createAction(ActionsTypes.resetAll);
