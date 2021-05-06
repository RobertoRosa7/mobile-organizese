import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public logo = 'assets/icon-default-white-512x512.svg';

  constructor(
    private modalController: ModalController,
    private router: NavController
  ) {}

  public async openDialog(type: string): Promise<any> {
    const modal = await this.modal(type);
    await modal.present();
  }

  private async modal(type: string, data?: any): Promise<HTMLIonModalElement> {
    return await this.modalController.create({
      component: ModalComponent,
      swipeToClose: true,
      componentProps: {
        type,
        data,
      },
    });
  }
}
