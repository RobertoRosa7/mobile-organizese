import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuards implements CanActivate {
  constructor(
    private loginService: LoginService,
    private toastController: ToastController,
    private router: NavController
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.loginService.isAuthenticated().pipe(
      tap(async (auth) => {
        if (!auth) {
          const toast = await this.createToast('Você não fez login ainda!');
          await toast.present();
          this.router.navigateForward('/home');
        }
      })
    );
  }

  private async createToast(message: string): Promise<HTMLIonToastElement> {
    return this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
  }
}
