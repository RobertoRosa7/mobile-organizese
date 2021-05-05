import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { RESET_ERRORS } from '../../actions/errors.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public logo = 'assets/icon-default-white-512x512.svg';

  constructor(
    private modalController: ModalController,
    private store: Store,
    private router: NavController
  ) {}

  public async openDialog(type: string): Promise<any> {
    const modal = await this.modal(type);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.router.navigateForward('/dashboard');
    }
    this.store.dispatch(RESET_ERRORS());
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
