/* eslint-disable @typescript-eslint/naming-convention */
import { keyframes } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  actionsTypes,
  GET_TOTALS,
  PUT_DATES,
  SET_DASHBOARD,
  SET_DATES,
  SET_GRAPH_OUTCOME_INCOME,
  SET_LASTDATE_OUTCOME,
} from '../actions/dashboard.actions';
import { SET_ERRORS, SourceErrors } from '../actions/errors.actions';
import { DashboardService } from '../services/dashboard.service';
import { StorageService } from '../services/storage.service';
import * as moment from 'moment';

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
              this.setPayloadOnStore('consolidado_id', payload)
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
              this.setPayloadOnStore('registersToDashboard', payload)
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

  public putDashboard$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.PUT_DASHBOARD),
      switchMap(() => from(this.getDatesFromStore())),
      mergeMap(({ dates }) =>
        this.dashboardService.fetchDashboard(dates).pipe(
          mergeMap((payload) =>
            this.setPayloadOnStore('registersToDashboard', payload)
          ),
          map(([_, payload]) => payload),
          catchError((e) => of(e))
        )
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: { ...payload, source: actionsTypes.ERROR_PUT_DASHBOARD },
          });
        } else {
          return SET_DASHBOARD({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  public putConsolidado$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.PUT_CONSOLIDADO),
      mergeMap(() =>
        this.dashboardService.fetchConsolidado().pipe(
          mergeMap((payload) =>
            this.setPayloadOnStore('consolidado_id', payload)
          ),
          map(([_, payload]) => payload),
          catchError((e) => of(e))
        )
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: { ...payload, source: actionsTypes.ERROR_PUT_CONSOLIDADO },
          });
        } else {
          return GET_TOTALS({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  public graphOutcomeIncome$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.FETCH_GRAPH_OUTCOME_INCOME),
      switchMap(() =>
        forkJoin([
          this.storageService.getStore('fetchGraphOutcomeIncome'),
          from(this.getDatesFromStore()),
        ])
      ),
      mergeMap(([store, { dates }]) => {
        if (store) {
          return of(store);
        } else {
          return this.dashboardService.fetchGraphOutcomeIncome(dates).pipe(
            mergeMap((payload) =>
              this.setPayloadOnStore('fetchGraphOutcomeIncome', payload)
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
              source: actionsTypes.ERROR_GRAPH_OUTCOME_INCOME,
            },
          });
        } else {
          return SET_GRAPH_OUTCOME_INCOME({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  public putOutcomeIncome = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.PUT_GRAPH_OUTCOME_INCOME),
      switchMap(() => from(this.getDatesFromStore())),
      mergeMap(({ dates }) =>
        this.dashboardService.fetchGraphOutcomeIncome(dates).pipe(
          mergeMap((payload) =>
            this.setPayloadOnStore('fetchGraphOutcomeIncome', payload)
          ),
          map(([_, payload]) => payload),
          catchError((e) => of(e))
        )
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: {
              ...payload,
              source: actionsTypes.ERROR_PUT_GRAPH_OUTCOME_INCOME,
            },
          });
        } else {
          return SET_GRAPH_OUTCOME_INCOME({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  public fetchLastdateOutcome = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.FETCH_LASTDATE_OUTCOME),
      mergeMap(() => this.storageService.getStore('lastDateOutcome')),
      mergeMap((payload: any) => {
        if (payload) {
          return of(payload);
        } else {
          return this.dashboardService.fetchLastDate().pipe(
            mergeMap((response: any) =>
              this.setPayloadOnStore('lastDateOutcome', response)
            ),
            map(([_, response]) => response),
            catchError((e) => of(e))
          );
        }
      }),
      map((payload: any) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: {
              ...payload,
              source: actionsTypes.ERROR_FETCH_LASTE_DATE_OUTCOME,
            },
          });
        } else {
          return SET_LASTDATE_OUTCOME({ payload });
        }
      }),
      catchError((e) => of(e))
    )
  );

  public putLastdateOutcome = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.PUT_LASTDATE_OUTCOME),
      mergeMap(() =>
        this.dashboardService.fetchLastDate().pipe(
          mergeMap((payload) =>
            this.setPayloadOnStore('lastDateOutcome', payload)
          ),
          map(([_, payload]) => payload),
          catchError((e) => of(e))
        )
      ),
      map((payload: any) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: {
              ...payload,
              source: actionsTypes.ERROR_PUT_GRAPH_OUTCOME_INCOME,
            },
          });
        } else {
          return SET_LASTDATE_OUTCOME({ payload });
        }
      }),
      catchError((e) => of(e))
    )
  );

  public setDatesFilter = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.FETCH_DATES),
      mergeMap(() => this.storageService.getStore('datesFilter')),
      mergeMap((store) => {
        if (store) {
          return of(store);
        } else {
          return from(this.getDatesFromStore()).pipe(
            mergeMap(({ dates }) =>
              this.setPayloadOnStore('datesFilter', dates)
            ),
            map(([_, payload]) => payload)
          );
        }
      }),
      map((payload) => SET_DATES({ payload })),
      catchError((e) => of(e))
    )
  );

  public putDatesFilters = createEffect(() =>
    this.action.pipe(
      ofType(actionsTypes.PUT_DATES),
      mergeMap(({ payload }) => this.setPayloadOnStore('datesFilter', payload)),
      map(([_, payload]) => SET_DATES({ payload })),
      catchError((e) => of(e))
    )
  );

  constructor(
    private action: Actions,
    private storageService: StorageService,
    private dashboardService: DashboardService,
    private store: Store
  ) {}
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

  private setPayloadOnStore(storeId: string, payload: any): Observable<any> {
    return forkJoin([
      this.storageService.setStore(storeId, payload),
      of(payload),
    ]);
  }

  private setDatesWhenPayloadIsEmpty(payload) {
    if (payload.outcome_income[0].dates.length === 0) {
      this.store.dispatch(
        PUT_DATES({
          payload: {
            dt_start: moment().subtract(10, 'days').toLocaleString(),
            dt_end: moment(new Date()).toLocaleString(),
          },
        })
      );
    }
  }
}
