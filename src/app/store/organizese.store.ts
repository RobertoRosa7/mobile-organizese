import { ActionReducerMap } from '@ngrx/store';
import { reducerApp } from '../reducers/app.reducer';

export const organizeseStore: ActionReducerMap<any> = {
  app: reducerApp,
};
