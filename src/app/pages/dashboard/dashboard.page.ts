/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, filter, map, mergeMap } from 'rxjs/operators';
import * as actionsDashboard from 'src/app/actions/dashboard.actions';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { Strings } from 'src/app/interfaces/strings';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import * as actionsProfile from '../../actions/profile.actions';
import * as actionsRegister from '../../actions/registers.actions';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public notifications$: Observable<any>;
  public profile$: Observable<any>;
  public states$: Observable<any>;

  constructor(
    protected store?: Store,
    protected storageService?: StorageService,
    protected popoverController?: PopoverController,
    protected profileService?: ProfileService,
    protected toastController?: ToastController,
    protected as?: ActionsSubject,
    protected dashboardService?: DashboardService
  ) {}

  ngOnInit() {
    console.log('its working!');
    this.initializeApp();
    this.fetchErrors();
    this.fetchSuccess();
    this.fetchLastRegister().subscribe(({ data: payload }) =>
      this.store?.dispatch(actionsDashboard.SET_NOTIFICATION_LIST({ payload }))
    );

    this.states$ = this.store.select(({ profile, dashboard }: any) => ({
      user: profile.profile,
      notification: dashboard.notification_list,
    }));
  }

  public sync(ev): void {}

  public notify(ev): void {
    this.presentPopover(ev, Strings.NOTIFY, {
      notify: this.states$.pipe(map((state) => state.notification)),
    });
  }

  public add(ev): void {
    this.presentPopover(ev, Strings.ADD_REGISTER, {
      profile: this.states$.pipe(map((state) => state.user)),
    });
  }

  public profile(ev): void {
    this.presentPopover(ev, Strings.PROFILE, {
      profile: this.states$.pipe(map((state) => state.user)),
    });
  }

  async presentPopover(ev: any, type: string, data?: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      translucent: true,
      event: ev,
      componentProps: {
        type,
        data,
      },
    });
    await popover.present();
    const event = (await popover.onDidDismiss()).data;
    if (event) {
      switch (event.payload.from) {
        case Strings.ADD_REGISTER:
          this.store.dispatch(
            actionsRegister.ADD_REGISTERS({ payload: event.payload })
          );
          break;
      }
    }
  }

  private fetchErrors(): void {
    const error$ = this.store
      .select(({ errors }: any) => ({
        error: this.handlerErrors(errors.error),
      }))
      .pipe(
        map((state) => state.error),
        delay(2000)
      );

    error$.subscribe(async (err) => {
      if (err) {
        const toast = await this.createToast(err.message);
        await toast.present();
      }
    });
  }

  private fetchSuccess(): void {
    const success$ = this.store
      .select(({ errors }: any) => ({
        success: this.handlerSuccess(errors.from),
      }))
      .pipe(map((state) => state.success));

    success$.subscribe(async (success) => {
      if (success) {
        const toast = await this.createToast(success);
        await toast.present();
      }
    });
  }

  private handlerSuccess(from: string): string {
    switch (from) {
      case actionsRegister.actionsTypes.SUCCESS_ADD_REGISTERS:
        return 'Registro cadastrado com sucesso.';
      default:
        return '';
    }
  }

  private initializeApp(): Promise<any> {
    return new Promise(async (resolve) => {
      await this.initDashboard();
      await this.getProfile();
      setTimeout(() => resolve(true), 500);
    });
  }

  private getProfile(): Promise<any> {
    return Promise.resolve(this.store.dispatch(actionsProfile.GET_PROFILE()));
  }

  private initDashboard(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.FETCH_DASHBOARD())
    );
  }

  private handlerErrors(error: any) {
    let message = '';
    switch (error.source) {
      case actionsDashboard.actionsTypes.ERROR_FETCH_DASHBOARD:
        if (error.status === 0) {
          message = 'Não foi possível carregar os registros.';
        } else {
          message = error.error.message;
        }
        return { ...error, message };
      case actionsProfile.ActionsTypes.ERROR_PROFILE:
        if (error.status === 0) {
          message = 'Não foi possível carregar seu perfil';
        } else {
          message = error.error.message;
        }
        return { ...error, message };
      case actionsRegister.actionsTypes.ERROR_ADD_REGISTERS:
        if (error.status === 0) {
          message = 'Não foi possível adicionar seu registro.';
        } else {
          message = error.error.message;
        }
        return { ...error, message };
    }
  }

  private async createToast(message: string): Promise<HTMLIonToastElement> {
    return this.toastController.create({
      message,
      duration: 5000,
      position: 'bottom',
    });
  }

  private onActionsTypes(type: string): Observable<any> {
    return this.as ? this.as.pipe(filter((a) => a.type === type)) : of(null);
  }

  private getLastRegister(list: any[]): number {
    return list.length > 0
      ? [...list].sort((a: any, b: any) => {
          if (a.created_at > b.created_at) {
            return -1;
          } else if (a.created_at < b.created_at) {
            return 1;
          }
          return 0;
        })[0].created_at
      : new Date().getTime();
  }

  private fetchLastRegister(): Observable<any> {
    return this.onActionsTypes(
      actionsDashboard.actionsTypes.SET_DASHBOARD
    ).pipe(
      map(({ payload }) => (payload ? [...payload.data.results] : [])),
      mergeMap((list) => {
        if (this.dashboardService) {
          return this.dashboardService?.fetchAllLastRegisters({
            last_date: this.getLastRegister(list),
          });
        } else {
          return of(null);
        }
      })
    );
  }
}
