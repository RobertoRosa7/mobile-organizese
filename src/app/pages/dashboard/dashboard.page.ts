/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ProfileService } from 'src/app/services/profile.service';
import { StorageService } from 'src/app/services/storage.service';
import { GET_PROFILE } from '../../actions/profile.actions';

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
    protected profileService?: ProfileService
  ) {}

  ngOnInit() {
    console.log('its working!');
    this.initializeApp();
    // this.store?.dispatch(actionsApp.onLine());
    // this.profileService.profileGet().subscribe((ev) => console.log(ev));
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
      await this.getProfile();
      setTimeout(() => resolve(true), 500);
    });
  }

  private getProfile(): Promise<any> {
    return Promise.resolve(this.store.dispatch(GET_PROFILE()));
  }
}
