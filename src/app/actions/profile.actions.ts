/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { createAction, props } from '@ngrx/store';

export enum ActionsTypes {
  SET_PROFILE = '[SET_PROFILE]',
  GET_PROFILE = '[GET_PROFILE]',

  PUT_PROFILE = '[PUT_PROFILE]',
  ERR_PUT_PROFILE = '[ERR_PUT_PROFILE]',
  SUCCESS_PUT_PROFILE = '[SUCCESS_PUT_PROFILE]',

  ERROR_PROFILE = '[ERROR_PROFILE]',
}
export const GET_PROFILE = createAction(ActionsTypes.GET_PROFILE);
export const SET_PROFILE = createAction(
  ActionsTypes.SET_PROFILE,
  props<{ payload: any }>()
);
export const UPDATE_PROFILE = createAction(
  ActionsTypes.PUT_PROFILE,
  props<{ payload: any }>()
);
