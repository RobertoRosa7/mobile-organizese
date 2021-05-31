import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { SET_ERRORS } from '../actions/errors.actions';
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
          const source = { ...payload, source: ActionsTypes.ERROR_PROFILE };
          console.log(source);
          SET_ERRORS({ payload: source });
        } else {
          return SET_PROFILE({ payload });
        }
      })
    )
  );

  constructor(
    private action: Actions,
    private storageService: StorageService,
    private profileService: ProfileService
  ) {}
}
