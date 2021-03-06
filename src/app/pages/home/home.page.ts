/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, Platform } from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public logo = 'assets/icon-default-white-512x512.svg';

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
  ) {
    this.backButtonEvent();
  }

  ngOnInit() {
  }

  public async openDialog(type: string): Promise<any> {
    const modal = await this.modal(type);
    await modal.present();
  }

  private backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        (navigator as any).app.exitApp();
      }
    });
  }

  private async modal(type: string, data?: any): Promise<HTMLIonModalElement> {
    return this.modalController.create({
      component: ModalComponent,
      swipeToClose: true,
      componentProps: {
        type,
        data: { type },
      },
    });
  }
}
