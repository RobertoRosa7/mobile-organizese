/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import * as actionsLogin from '../actions/login.actions';
import { User } from '../interfaces/general';
import { Constants } from './constants';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private user$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private loggedIn$: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(
    private http: HttpClient,
    private constants: Constants,
    private storageService: StorageService,
    private store: Store,
    private router: NavController,
    private toast: ToastController
  ) {}

  public signup(payload: User): Observable<User> {
    return this.http.post<User>(this.constants.get('signup'), payload);
  }

  public signin(payload: any): Observable<any> {
    return this.http
      .get(this.constants.get('signin'), {
        headers: this.encriptPayload(payload),
      })
      .pipe(
        mergeMap((token: any) => {
          if (token) {
            if (payload.keepConnect) {
              sessionStorage.clear();
              return this.storageService.setStore('token', token.access_token);
            } else {
              return this.storageService.clear().pipe(
                map(() => {
                  sessionStorage.setItem('token', token.access_token);
                  return token.access_token;
                })
              );
            }
          }
        }),
        map((token: any) => token)
      );
  }

  public fetchToken(): Observable<any> {
    if (sessionStorage.getItem('token')) {
      return of(sessionStorage.getItem('token'));
    } else {
      return this.storageService.getStore('token');
    }
  }

  public isAuthenticated(): Observable<boolean> {
    return this.loggedIn$.asObservable().pipe(
      mergeMap(() => this.fetchToken()),
      map((res) => (res ? true : false))
    );
  }

  public fetchUser(): Observable<any> {
    this.getUser();
    return this.user$.asObservable();
  }

  public logout(): Observable<any> {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    this.storageService.clear().subscribe();

    this.user$.next(null);
    this.loggedIn$.next(false);

    return this.loggedIn$.asObservable();
  }

  public loginVerified(payload: any): Observable<any> {
    return this.http.post<any>(this.constants.get('loginVerified'), payload);
  }

  public resetPassword(payload: any): Observable<any> {
    const authorization = {
      Authorization: `${btoa(payload.password)}:access:${payload.token}`,
    };
    return this.http.get<any>(this.constants.get('resetPassword'), {
      headers: authorization,
    });
  }

  public mailToReset(payload: any): Observable<any> {
    return this.http.post<any>(this.constants.get('emailToReset'), payload);
  }

  public emailToVerified(payload: any): Observable<any> {
    return this.http.get(this.constants.get('emailToVerified'), {
      headers: this.encriptPayload(payload),
    });
  }

  public async sessionIsOver(message: string): Promise<any> {
    this.store.dispatch(actionsLogin.LOGOUT());
    this.router.navigateForward('/home');
    const toast = await this.toast.create({message, duration: 3000,position: 'bottom'});
    await toast.present();
  }

  private encriptPayload(payload: any) {
    return {
      Authorization: `${btoa(payload.email)}:${btoa(payload.password)}`,
    };
  }

  private getUser(): void {
    if (localStorage.getItem('user')) {
      this.user$.next(JSON.parse(localStorage.getItem('user') || '{}'));
    } else if (sessionStorage.getItem('user')) {
      this.user$.next(JSON.parse(sessionStorage.getItem('user') || '{}'));
    } else {
      this.user$.next(null);
    }
  }
}
