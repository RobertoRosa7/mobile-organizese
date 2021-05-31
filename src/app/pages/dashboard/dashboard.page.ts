/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { delay, map } from 'rxjs/operators';
import * as actionsDashboard from 'src/app/actions/dashboard.actions';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import * as actionsProfile from '../../actions/profile.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  constructor(
    protected store?: Store,
    protected storageService?: StorageService,
    protected popoverController?: PopoverController,
    protected profileService?: ProfileService,
    protected toastController?: ToastController
  ) {}

  ngOnInit() {
    console.log('its working!');
    this.initializeApp();

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

  public sync(ev): void {}

  public notify(ev): void {}

  public add(ev): void {
    this.presentPopover(ev, 'add-registers');
  }

  public profile(ev): void {
    const profile = this.store
      .select(({ profile }: any) => ({
        user: profile.profile,
      }))
      .pipe(map((state) => state.user));

    this.presentPopover(ev, 'profile', { profile });
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
    // const { role } = await popover.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
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
    }
  }

  private async createToast(message: string): Promise<HTMLIonToastElement> {
    return this.toastController.create({
      message,
      duration: 5000,
      position: 'bottom',
    });
  }
}
