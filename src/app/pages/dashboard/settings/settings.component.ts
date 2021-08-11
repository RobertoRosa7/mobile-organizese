import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { delay, map } from 'rxjs/operators';
import { ProfileService } from 'src/app/services/profile.service';
import * as settings from '../../../../../package.json';
import * as actionsApp from '../../../actions/app.actions';
import * as actionsLogin from '../../../actions/login.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public settings;
  public user;

  constructor(
    private store: Store,
    private alertController: AlertController,
    private profileService: ProfileService,
    private toastController: ToastController,
    private router: NavController
  ) {}

  ngOnInit() {
    this.settings = settings;
    this.store.dispatch(actionsApp.HIDE_BUTTON_BACK({payload: true}));

    this.store.select(({ profile }: any) => ({ profile: profile.profile }))
      .pipe(map((state) => state.profile)).subscribe((profile) => this.user = profile);
  }

  public async logout(): Promise<any> {
    this.store.dispatch(actionsLogin.LOGOUT());
    this.router.navigateForward('/');
    const snackbar = await this.createToast('Sessão encerrada');
    await snackbar.present();
  }

  public async deleteAccount(): Promise<any> {
    const modal = await this.alertController.create({
      message: 'Tem certeza que quer excluir sua conta?',
      cssClass: 'dialog-confirm',
      buttons: [
        {
          text: 'Excluir',
          cssClass: 'btn-delete',
          handler: async () => {
            let snackbar = await this.createToast('Aguarde enquanto a conta será excluída.');
            await snackbar.present();

            this.profileService.profileDeleteUser(this.user).pipe(delay(3000)).subscribe(async (res) => {
              this.store.dispatch(actionsLogin.LOGOUT());
              this.router.navigateForward('/');
              snackbar = await this.createToast(res.message);
              await snackbar.present();
            },
            async (err) => {
              snackbar = await this.createToast(err.error.message);
              await snackbar.present();
            });
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'btn-cancel'
        },
      ],
    });
    await modal.present();
  }

  protected async createToast(message: string): Promise<HTMLIonToastElement> {
    return this.toastController.create({
      message,
      duration: 5000,
      position: 'bottom',
    });
  }
}
