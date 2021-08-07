import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public isLoading: boolean;
  public token: string;

  constructor(
    protected toastController: ToastController,
    protected loginService: LoginService,
  ) { }

  ngOnInit() {
  }

  protected setIsLoading(payload: boolean): void {
    this.isLoading = payload;
  }

  protected onSubmitSuccess(res): void {
    this.setIsLoading(false);
    this.notification(res.message);
  }

  protected onsSubmitError(err): void {
    this.setIsLoading(false);
    this.notification(err.error.message);
  }

  protected async notification(message: string): Promise<any> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  protected mapCheckIfToken(params): Observable<any> {
    if (params.token) {
      this.token = params.token;
      return this.loginService.loginVerified({ token: params.token });
    } else {
      return of(null);
    }
  }

}
