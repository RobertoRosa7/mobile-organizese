import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  actionsTypes,
  GET_TOTALS,
  SET_DASHBOARD,
} from '../actions/dashboard.actions';
import { SET_ERRORS, SourceErrors } from '../actions/errors.actions';
import { DashboardService } from '../services/dashboard.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class DashboardEffect {
  public init$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.INIT_DASHBOARD),
      switchMap(() => this.storageService.getStore('consolidado_id')),
      mergeMap((store) => {
        if (store) {
          return of(store);
        } else {
          return this.dashboardService.fetchConsolidado().pipe(
            mergeMap((payload) =>
              forkJoin([
                this.storageService.setStore('consolidado_id', payload),
                of(payload),
              ])
            ),
            map(([_, payload]) => payload),
            catchError((e) => of(e))
          );
        }
      }),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: { ...payload, source: SourceErrors.INIT_DASHBOARD },
          });
        } else {
          return GET_TOTALS({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  public fetchDashboard$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.FETCH_DASHBOARD),
      switchMap(() =>
        forkJoin([
          this.storageService.getStore('registersToDashboard'),
          from(this.getDatesFromStore()),
        ])
      ),
      mergeMap(([store, { dates }]) => {
        if (store) {
          return of(store);
        } else {
          return this.dashboardService.fetchDashboard(dates).pipe(
            mergeMap((payload) =>
              forkJoin([
                this.storageService.setStore('registersToDashboard', payload),
                of(payload),
              ])
            ),
            map(([_, payload]) => payload),
            catchError((e) => of(e))
          );
        }
      }),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: {
              ...payload,
              source: actionsTypes.ERROR_FETCH_DASHBOARD,
            },
          });
        } else {
          return SET_DASHBOARD({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  constructor(
    private action: Actions,
    private storageService: StorageService,
    private dashboardService: DashboardService,
    private store: Store
  ) {}

  // @Effect()
  // public putConsolidado$: Observable<Actions> = this.action.pipe(
  //   ofType(actions.actionsTypes.PUT_CONSOLIDADO),
  //   mergeMap(() =>
  //     this.dashboardService.fetchConsolidado().pipe(
  //       map((payload) => {
  //         this.indexedb.update({ id: 'consolidado_id', payload });
  //         return payload;
  //       }),
  //       catchError((e) => of(e))
  //     )
  //   ),
  //   map((payload) => {
  //     if (payload instanceof HttpErrorResponse) {
  //       const source = { ...payload, source: 'update_consolidado' };
  //       return SET_ERRORS({ payload: source });
  //     } else {
  //       return actions.GET_TOTALS({ payload });
  //     }
  //   }),
  //   catchError((err) => of(err))
  // );

  // @Effect()
  // public getAutocomplete$: Observable<Actions> = this.action.pipe(
  //   ofType(actions.FETCH_AUTOCOMPLETE),
  //   mergeMap(() => this.indexedb.getById('autocomplete_id')),
  //   mergeMap((autocomplete) => {
  //     if (autocomplete) {
  //       return [
  //         actions.SET_AUTOCOMPLETE({ payload: autocomplete.auto_complete }),
  //       ];
  //     } else {
  //       return this.dashboardService.fetchAutocomplete().pipe(
  //         map((autocomplete: any) => {
  //           if (autocomplete) {
  //             this.indexedb.create({
  //               id: 'autocomplete_id',
  //               auto_complete: autocomplete.list,
  //             });
  //           }
  //           return actions.SET_AUTOCOMPLETE({ payload: autocomplete.list });
  //         }),
  //         catchError((e) => {
  //           const source = { ...e, source: 'autocomplete' };
  //           return [SET_ERRORS({ payload: source })];
  //         })
  //       );
  //     }
  //   }),
  //   catchError((err) => of(err))
  // );

  // @Effect()
  // public updateAutocomplete$: Observable<Actions> = this.action.pipe(
  //   ofType(actions.UPDATE_AUTOCOMPLETE),
  //   mergeMap(() =>
  //     forkJoin([
  //       this.dashboardService
  //         .fetchAutocomplete()
  //         .pipe(catchError((e) => of(e))),
  //       this.indexedb.getById('autocomplete_id'),
  //     ])
  //   ),
  //   map(([autocomplete, indexedbList]) => {
  //     if (autocomplete instanceof HttpErrorResponse) {
  //       const source = { ...autocomplete, source: 'update_autocomplete' };
  //       return SET_ERRORS({ payload: source });
  //     } else {
  //       if (indexedbList) {
  //         this.indexedb.update({
  //           id: 'autocomplete_id',
  //           auto_complete: autocomplete.list,
  //         });
  //         return actions.SET_AUTOCOMPLETE({ payload: autocomplete.list });
  //       } else {
  //         this.indexedb.create({
  //           id: 'autocomplete_id',
  //           auto_complete: autocomplete.list,
  //         });
  //         return actions.SET_AUTOCOMPLETE({ payload: autocomplete.list });
  //       }
  //     }
  //   }),
  //   catchError((err) => of(err))
  // );

  // @Effect()
  // public graphOutcomeIncome$: Observable<Actions> = this.action.pipe(
  //   ofType(actions.actionsTypes.FETCH_GRAPH_OUTCOME_INCOME),
  //   switchMap(() =>
  //     forkJoin([
  //       this.indexedb.getById('outcome_income_id'),
  //       from(this.getDatesFromStore()),
  //     ])
  //   ),
  //   mergeMap(([payload, { dates }]) => {
  //     if (payload) {
  //       return of(payload.payload);
  //     } else {
  //       return this.dashboardService.fetchGraphOutcomeIncome(dates).pipe(
  //         map((payload) => {
  //           this.indexedb.create({
  //             id: 'outcome_income_id',
  //             payload,
  //           });
  //           return payload;
  //         }),
  //         catchError((e) => of(e))
  //       );
  //     }
  //   }),
  //   map((payload) => {
  //     if (payload instanceof HttpErrorResponse) {
  //       const source = { ...payload, source: 'graph_outcome_income' };
  //       return SET_ERRORS({ payload: source });
  //     } else {
  //       return actions.SET_GRAPH_OUTCOME_INCOME({ payload });
  //     }
  //   }),
  //   catchError((err) => of(err))
  // );

  // @Effect()
  // public putOutcomeIncome$: Observable<Actions> = this.action.pipe(
  //   ofType(actions.actionsTypes.PUT_GRAPH_OUTCOME_INCOME),
  //   switchMap(() => from(this.getDatesFromStore())),
  //   mergeMap(({ dates }) =>
  //     this.dashboardService.fetchGraphOutcomeIncome(dates).pipe(
  //       map((payload) => {
  //         this.indexedb.update({ id: 'outcome_income_id', payload });
  //         return payload;
  //       }),
  //       catchError((e) => of(e))
  //     )
  //   ),
  //   map((payload) => {
  //     if (payload instanceof HttpErrorResponse) {
  //       const source = { ...payload, source: 'put_outcome_income' };
  //       return SET_ERRORS({ payload: source });
  //     } else {
  //       return actions.SET_GRAPH_OUTCOME_INCOME({ payload });
  //     }
  //   }),
  //   catchError((err) => of(err))
  // );

  // @Effect()
  // public putDashboard$: Observable<Actions> = this.action.pipe(
  //   ofType(actions.actionsTypes.PUT_DASHBOARD),
  //   switchMap(() => from(this.getDatesFromStore())),
  //   mergeMap(({ dates }) =>
  //     this.dashboardService.fetchDashboard(dates).pipe(
  //       map((payload) => {
  //         this.indexedb.update({ id: 'registers_to_dashboard_id', payload });
  //         return payload;
  //       }),
  //       catchError((e) => of(e))
  //     )
  //   ),
  //   map((payload) => {
  //     if (payload instanceof HttpErrorResponse) {
  //       const source = { ...payload, source: 'put_dashboard' };
  //       return SET_ERRORS({ payload: source });
  //     } else {
  //       return actions.SET_DASHBOARD({ payload });
  //     }
  //   }),
  //   catchError((err) => of(err))
  // );

  // @Effect()
  // public devMode$: Observable<Actions> = this.action.pipe(
  //   ofType(actions.GET_DEV_MODE),
  //   mergeMap(({ payload }) =>
  //     this.dashboardService.setDevMode(payload).pipe(catchError((e) => of(e)))
  //   ),
  //   map((payload: any) => {
  //     if (payload instanceof HttpErrorResponse) {
  //       const source = { ...payload, source: 'dev_mode' };
  //       return SET_ERRORS({ payload: source });
  //     } else {
  //       return actions.SET_DEV_MODE({ payload });
  //     }
  //   }),
  //   catchError((e) => of(e))
  // );

  // @Effect()
  // public fetchLastdateOutcome$: Observable<Actions> = this.action.pipe(
  //   ofType(actions.FETCH_LASTDATE_OUTCOME),
  //   mergeMap(() => this.indexedb.getById('lastdate_outcome_id')),
  //   mergeMap((payload) => {
  //     if (payload) {
  //       return of(payload.payload);
  //     } else {
  //       return this.dashboardService.fetchLastDate().pipe(
  //         map((payload) => {
  //           this.indexedb.create({ id: 'lastdate_outcome_id', payload });
  //           return payload;
  //         }),
  //         catchError((e) => of(e))
  //       );
  //     }
  //   }),
  //   map((payload: any) => {
  //     if (payload instanceof HttpErrorResponse) {
  //       const source = { ...payload, source: 'lastdate_outcome' };
  //       return SET_ERRORS({ payload: source });
  //     } else {
  //       return actions.SET_LASTDATE_OUTCOME({ payload });
  //     }
  //   }),
  //   catchError((e) => of(e))
  // );

  // @Effect()
  // public putLastdateOutcome$: Observable<Actions> = this.action.pipe(
  //   ofType(actions.PUT_LASTDATE_OUTCOME),
  //   mergeMap(() =>
  //     this.dashboardService.fetchLastDate().pipe(
  //       map((payload) => {
  //         this.indexedb.update({ id: 'lastdate_outcome_id', payload });
  //         return payload;
  //       }),
  //       catchError((e) => of(e))
  //     )
  //   ),
  //   map((payload: any) => {
  //     if (payload instanceof HttpErrorResponse) {
  //       const source = { ...payload, source: 'put_lastdate_outcome' };
  //       return SET_ERRORS({ payload: source });
  //     } else {
  //       return actions.SET_LASTDATE_OUTCOME({ payload });
  //     }
  //   }),
  //   catchError((e) => of(e))
  // );

  private getDatesFromStore(): Promise<any> {
    return new Promise((resolve) =>
      this.getDates().subscribe((dates) => resolve(dates))
    );
  }

  private getDates(): Observable<any> {
    return this.store.select(({ dashboard }: any) => ({
      dates: dashboard.graph_dates,
    }));
  }
}
