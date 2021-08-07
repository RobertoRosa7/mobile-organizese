/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit } from '@angular/core';
import {
  IonRouterOutlet,
  MenuController,
  ModalController,
  NavController, PopoverController,
  ToastController
} from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, filter, map, mergeMap } from 'rxjs/operators';
import * as actionsDashboard from 'src/app/actions/dashboard.actions';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { Strings } from 'src/app/interfaces/strings';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { SubjectService } from 'src/app/services/subject.service';
import * as actionsErrors from '../../actions/errors.actions';
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
  public showButtonBack: boolean;

  constructor(
    public subjectService?: SubjectService,
    protected store?: Store,
    protected storageService?: StorageService,
    protected popoverController?: PopoverController,
    protected profileService?: ProfileService,
    protected toastController?: ToastController,
    protected as?: ActionsSubject,
    protected dashboardService?: DashboardService,
    protected router?: NavController,
    protected menu?: MenuController,
    protected modalController?: ModalController,
    protected routerOutlet?: IonRouterOutlet
  ) {}

  ngOnInit() {
    this.fetchLastRegister().subscribe(({ data: payload }) =>
      this.store?.dispatch(actionsDashboard.SET_NOTIFICATION_LIST({ payload }))
    );

    this.initializeApp();
    this.fetchErrors();
    this.fetchSuccess();

    this.states$ = this.store.select(({ profile, dashboard, app }: any) => ({
      user: profile.profile,
      notification: dashboard.notification_list,
      hideButtonBack: app.hideButtonBack
    }));
  }

  public sync(): void {
    this.dispatchActions();
  }

  public notify(ev: any): void {
    this.presentPopover(ev, Strings.NOTIFY, {
      notify: this.states$.pipe(map((state) => state.notification)),
    });
  }

  public async add(type: string): Promise<any> {
    const modal = await this.modalController.create({
      component: ModalComponent,
      swipeToClose: true,
      componentProps: {
        data: {
          edit: false,
          type: 'add-registers',
          operation: type,
          profile: this.states$,
          extract: null,
        },
      },
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  public profile(): void {
    this.menu.open('main');
  }

  public closeMenu(): void {
    this.menu.close('main');
  }

  public async presentPopover(ev: any, type: string, data?: any) {
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
  }

  public backToDashboard(): void {
    console.log('back', this.router);
  }

  public logout(): void {
    (navigator as any).app.exitApp();
  }

  protected fetchErrors(): void {
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
        this.store.dispatch(actionsErrors.RESET_ERRORS());
      }
    });
  }

  protected fetchSuccess(): void {
    const success$ = this.store
      .select(({ errors }: any) => ({
        success: this.handlerSuccess(errors.from),
      }))
      .pipe(map((state) => state.success));

    success$.subscribe(async (success) => {
      if (success) {
        const toast = await this.createToast(success);
        await toast.present();
        this.store.dispatch(actionsErrors.RESET_ERRORS());
      }
    });
  }

  protected handlerSuccess(from: string): string {
    switch (from) {
      case actionsRegister.actionsTypes.SUCCESS_ADD_REGISTERS:
        return 'Registro cadastrado com sucesso.';
      case actionsRegister.actionsTypes.SUCCESS_DELETE_REGISTERS:
        return 'Registro excluído com sucesso.';
      case actionsRegister.actionsTypes.SUCCESS_UPDATE_REGISTERS:
        return 'Registro atualizado com sucesso.';
      case actionsProfile.ActionsTypes.SUCCESS_PUT_PROFILE:
        return 'Perfil atualizado com sucesso.';
      default:
        return '';
    }
  }

  protected async initializeApp(): Promise<any> {
    await this.getProfile();
  }

  protected getProfile(): Promise<any> {
    return Promise.resolve(this.store.dispatch(actionsProfile.GET_PROFILE()));
  }

  protected async createToast(message: string): Promise<HTMLIonToastElement> {
    return this.toastController.create({
      message,
      duration: 5000,
      position: 'bottom',
    });
  }

  protected onActionsTypes(type: string): Observable<any> {
    return this.as ? this.as.pipe(filter((a) => a.type === type)) : of(null);
  }

  protected getLastRegister(list: any[]): number {
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

  protected fetchLastRegister(): Observable<any> {
    return this.onActionsTypes(actionsDashboard.actionsTypes.SET_DASHBOARD).pipe(
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

  protected async dispatchActions(payload?: any): Promise<any> {
    await this.putDashboard();
    await this.putConsolidado();
    await this.putGraphOutcomeIncome();
    await this.putLastDateOutcome();
    // await this.putAutocomplete();
    await this.messageSuccess(payload);
    const toast = await this.createToast('Aplicação atualizada.');
    await toast.present();
  }

  protected putDashboard(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.PUT_DASHBOARD())
    );
  }

  protected putConsolidado(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.PUT_CONSOLIDADO())
    );
  }

  protected putGraphOutcomeIncome(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.PUT_GRAPH_OUTCOME_INCOME())
    );
  }

  protected putLastDateOutcome(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.PUT_LASTDATE_OUTCOME())
    );
  }

  protected putAutocomplete(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.UPDATE_AUTOCOMPLETE())
    );
  }

  protected messageSuccess(payload) {
    return Promise.resolve(
      this.store.dispatch(actionsErrors.SET_SUCCESS({ payload }))
    );
  }

  protected handlerErrors(error: any) {
    let message = '';
    switch (error.source) {
      case actionsDashboard.actionsTypes.ERROR_FETCH_DASHBOARD:
        if (error.status === 0) {
          message = 'Não foi possível carregar os registros.';
        } else {
          message = error.error.message;
        }
        return { ...error, message };
      case actionsDashboard.actionsTypes.ERROR_GRAPH_OUTCOME_INCOME:
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
      case actionsRegister.actionsTypes.ERROR_DELETE_REGISTERS:
        if (error.status === 0) {
          message = 'Não foi possível remover registro.';
        } else {
          message = error.error.message;
        }
        return { ...error, message };
      case actionsRegister.actionsTypes.ERROR_UPDATE_REGISTERS:
        if (error.status === 0) {
          message = 'Não foi possível atualizar registro.';
        } else {
          message = error.error.message;
        }
        return { ...error, message };
    }
  }
}
