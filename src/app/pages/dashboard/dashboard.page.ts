import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  constructor(
    protected store?: Store,
    protected storageService?: StorageService,
    protected popoverController?: PopoverController
  ) {}

  ngOnInit() {
    console.log('its working!');
    // this.store?.dispatch(actionsApp.onLine());
  }

  public sync(ev): void {}

  public notify(ev): void {}

  public add(ev): void {
    this.presentPopover(ev, 'add-registers');
  }

  public profile(ev): void {
    this.presentPopover(ev, 'profile');
  }

  async presentPopover(ev: any, type: string) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      translucent: true,
      event: ev,
      componentProps: {
        type,
      },
    });
    await popover.present();
    // const { role } = await popover.onDidDismiss();
    // console.log('onDidDismiss resolved with role', role);
  }
}
