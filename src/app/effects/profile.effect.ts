import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { SET_ERRORS, SET_SUCCESS } from '../actions/errors.actions';
import { ActionsTypes, SET_PROFILE } from '../actions/profile.actions';
import { ProfileService } from '../services/profile.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileEffect {
  public getProfile = createEffect(() =>
    this.action.pipe(
      ofType(ActionsTypes.GET_PROFILE),
      switchMap(() => this.storageService.getStore('profile')),
      mergeMap((store) => {
        if (store) {
          return of(store);
        } else {
          return this.profileService.profileGet().pipe(
            mergeMap((payload) =>
              forkJoin([
                this.storageService.setStore('profile', payload),
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
          SET_ERRORS({
            payload: { ...payload, source: ActionsTypes.ERROR_PROFILE },
          });
        } else {
          return SET_PROFILE({ payload });
        }
      })
    )
  );

  public updateProfile = createEffect(() =>
    this.action.pipe(
      ofType(ActionsTypes.PUT_PROFILE),
      mergeMap(({ payload }) =>
        this.profileService.profileUpdate(payload).pipe(
          mergeMap((profile) =>
            forkJoin([
              this.storageService.setStore('profile', profile),
              of(profile),
            ])
          ),
          map(([_, pro]) => pro),
          catchError((e) => of(e))
        )
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          return SET_ERRORS({
            payload: { ...payload, source: ActionsTypes.ERR_PUT_PROFILE },
          });
        } else {
          this.dispatchActions({
            payload: ActionsTypes.SUCCESS_PUT_PROFILE,
          });
          return SET_PROFILE({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  constructor(
    private action: Actions,
    private storageService: StorageService,
    private profileService: ProfileService,
    private store: Store
  ) {}

  private async dispatchActions(payload): Promise<any> {
    await this.putMessageOnSuccess(payload);
  }

  private putMessageOnSuccess(payload): Promise<any> {
    return Promise.resolve(this.store.dispatch(SET_SUCCESS(payload)));
  }
}
