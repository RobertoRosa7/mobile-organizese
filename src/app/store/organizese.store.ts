import { ActionReducerMap } from '@ngrx/store';
import { reducerApp } from '../reducers/app.reducer';
import { reducerDashboard } from '../reducers/dashboard.reducer';

export const organizeseStore: ActionReducerMap<any> = {
  app: reducerApp,
  dashboard: reducerDashboard,
};
