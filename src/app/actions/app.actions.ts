import { createAction, props } from '@ngrx/store';

export enum ActionsTypes {
  online = '[online]',
  setOnline = '[setOnline]',
  resetAll = '[resetAll]',
  hideValues = '[hideValues]',
}

export const onLine = createAction(ActionsTypes.online);
export const setonline = createAction(
  ActionsTypes.setOnline,
  props<{ payload: any }>()
);
export const hidevalues = createAction(
  ActionsTypes.hideValues,
  props<{ payload: any }>()
);
export const resetall = createAction(ActionsTypes.resetAll);
