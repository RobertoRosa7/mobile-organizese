/* eslint-disable @typescript-eslint/naming-convention */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actionsDashboard from '../actions/dashboard.actions';
import { SET_ERRORS, SET_SUCCESS } from '../actions/errors.actions';
import * as actions from '../actions/registers.actions';
import { DashboardService } from '../services/dashboard.service';

@Injectable()
export class RegistersEffect {
  public init$ = createEffect(() =>
    this.action.pipe(
      ofType(actions.actionsTypes.INIT),
      mergeMap(({ payload }) =>
        this.dashboardService
          .fetchRegisters(payload)
          .pipe(catchError((e) => of(e)))
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: {
              ...payload,
              source: actions.actionsTypes.ERROR_INIT,
            },
          });
        } else {
          return actions.GET_REGISTERS({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  public addRegisters$ = createEffect(() =>
    this.action.pipe(
      ofType(actions.actionsTypes.ADD_REGISTERS),
      map(({ payload }) => {
        this.store.dispatch(actions.ADDED_REGISTERS({ payload }));
        return actions.SET_REGISTERS({ payload });
      }),
      catchError((err) => of(err))
    )
  );

  public addedRegister$ = createEffect(() =>
    this.action.pipe(
      ofType(actions.actionsTypes.ADDED_REGISTERS),
      mergeMap(({ payload }) =>
        this.dashboardService
          .newRegister(payload)
          .pipe(catchError((e) => of(e)))
      ),
      map((response) => {
        if (response instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: {
              ...response,
              source: actions.actionsTypes.ERROR_ADD_REGISTERS,
            },
          });
        } else {
          this.dispatchActions({
            payload: actions.actionsTypes.SUCCESS_ADD_REGISTERS,
          });
          return actions.INIT({ payload: {} });
        }
      }),
      catchError((e) => of(e))
    )
  );

  public deleteRegisters = createEffect(() =>
    this.action.pipe(
      ofType(actions.actionsTypes.DELETE_REGISTERS),
      mergeMap(({ payload }: any) =>
        this.dashboardService
          .deleteRegister(payload)
          .pipe(catchError((e) => of(e)))
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: {
              ...payload,
              source: actions.actionsTypes.ERROR_DELETE_REGISTERS,
            },
          });
        } else {
          this.dispatchActions({
            payload: actions.actionsTypes.SUCCESS_DELETE_REGISTERS,
          });
          return actions.GET_REGISTERS({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  public updateRegister = createEffect(() =>
    this.action.pipe(
      ofType(actions.actionsTypes.UPDATE_REGISTER),
      mergeMap(({ payload }: any) =>
        forkJoin([
          this.dashboardService
            .updateRegister(payload)
            .pipe(catchError((e) => of(e))),
          of(payload),
        ])
      ),
      map(([response, _]) => {
        if (response instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: {
              ...response,
              source: actions.actionsTypes.ERROR_UPDATE_REGISTERS,
            },
          });
        } else {
          this.dispatchActions({
            payload: actions.actionsTypes.SUCCESS_UPDATE_REGISTERS,
          });
          return actions.SET_UPDATE({ payload: response.data });
        }
      }),
      catchError((err) => of(err))
    )
  );

  constructor(
    private action: Actions,
    private store: Store,
    private dashboardService: DashboardService
  ) {}

  private async dispatchActions(payload?: any): Promise<any> {
    await this.setTime();
    await this.putDashboard();
    await this.putGraphOutcomeIncome();
    await this.putLastDateOutcome();
    await this.putConsolidado();
    // await this.putAutocomplete();

    await this.putMessageOnSuccess(payload);
  }

  private async putDashboard(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.PUT_DASHBOARD())
    );
  }

  private async putConsolidado(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.PUT_CONSOLIDADO())
    );
  }

  private async putGraphOutcomeIncome(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.PUT_GRAPH_OUTCOME_INCOME())
    );
  }

  private async putLastDateOutcome(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.PUT_LASTDATE_OUTCOME())
    );
  }

  private async putAutocomplete(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.UPDATE_AUTOCOMPLETE())
    );
  }

  private putMessageOnSuccess(payload): Promise<any> {
    return Promise.resolve(this.store.dispatch(SET_SUCCESS(payload)));
  }

  private setTime(): Promise<any> {
    return new Promise((resolve) => setTimeout(() => resolve(true), 2000));
  }
}
