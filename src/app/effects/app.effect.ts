import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actionsApp from '../actions/app.actions';
import { AppService } from '../services/app.services';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AppEffect {
  public online$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsApp.onLine),
      mergeMap(() => this.appService.isOnline().pipe(catchError((e) => of(e)))),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          console.log('error');
        } else {
          return actionsApp.setonline({ payload });
        }
      }),
      catchError((e) => of(e))
    )
  );

  public putHideValues = createEffect(() =>
    this.action.pipe(
      ofType(actionsApp.SET_HIDE_VALUES),
      mergeMap(({ payload }) =>
        this.storageService.setStore('hideValues', payload)
      ),
      map((payload) => actionsApp.PUT_HIDE_VALUES({ payload })),
      catchError((e) => of(e))
    )
  );

  public getHideValues = createEffect(() =>
    this.action.pipe(
      ofType(actionsApp.GET_HIDE_VALUES),
      mergeMap(() => this.storageService.getStore('hideValues')),
      map((payload) => actionsApp.PUT_HIDE_VALUES({ payload })),
      catchError((e) => of(e))
    )
  );

  constructor(
    private action: Actions,
    private appService: AppService,
    private storageService: StorageService
  ) {}
}
