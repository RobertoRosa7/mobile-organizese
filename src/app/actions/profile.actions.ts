/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import { createAction, props } from '@ngrx/store';

export enum ActionsTypes {
  SET_PROFILE = '[SET_PROFILE]',
  GET_PROFILE = '[GET_PROFILE]',
  ERROR_PROFILE = '[ERROR_PROFILE]',
}
export const GET_PROFILE = createAction(ActionsTypes.GET_PROFILE);
export const SET_PROFILE = createAction(
  ActionsTypes.SET_PROFILE,
  props<{ payload: any }>()
);
