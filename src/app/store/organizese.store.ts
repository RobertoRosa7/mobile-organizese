import { ActionReducerMap } from '@ngrx/store';
import { reducerApp } from '../reducers/app.reducer';
import { reducerDashboard } from '../reducers/dashboard.reducer';
import { reducerErrors } from '../reducers/errors.reducer';
import { reducerLogin } from '../reducers/login.reducer';

export const organizeseStore: ActionReducerMap<any> = {
  app: reducerApp,
  dashboard: reducerDashboard,
  login: reducerLogin,
  errors: reducerErrors,
};
