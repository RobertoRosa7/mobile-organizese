/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';
import { LoginPage } from '../login.page';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent extends LoginPage implements OnInit {
  public isPasswordSame = false;
  public textIcon = 'password';
  public changeIcon = 'visibility_off';
  public changeTextLogin = 'Não tenho conta';
  public isLogin = false;
  public isLoginText = 'login';
  public isLoading = false;
  public token = '';

  public formNewPassword: FormGroup = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
      confirm_password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
    },
    { validator: this.checkPassword('password', 'confirm_password') }
  );

  constructor(
    protected toastController: ToastController,
    protected loginService: LoginService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: NavController,
  ) {
    super(toastController, loginService);
  }

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(switchMap((params: any) => this.mapCheckIfToken(params)))
      .subscribe({ next: (res) => this.onCheckIfVerifiedSuccess(res), error: (err) => this.onCheckIfVerifiedError(err)});
  }

  public onSubmit(event: any): void {
    event.preventDefault();
    this.setIsLoading(true);
    this.loginService.resetPassword({ password: this.formNewPassword.value.password, token: this.token })
      .subscribe({ next: (res) => this.onSubmitSuccess(res), error: (err) => this.onsSubmitError(err) });
  }

  public checkPassword(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        this.isPasswordSame = matchingControl.status === 'VALID' ? true : false;
      } else {
        matchingControl.setErrors(null);
        this.isPasswordSame = matchingControl.status === 'VALID' ? true : false;
      }
    };
  }

  public changeVisibility(str: string): void {
    this.textIcon = str === 'password' ? 'text' : 'password';
    this.changeIcon = str === 'password' ? 'visibility' : 'visibility_off';
  }

  private onCheckIfVerifiedSuccess(res): void {
    this.notification('Token verificado!');
  }

  private onCheckIfVerifiedError(err): void {
    this.router.navigateForward('/');
    this.notification(err.error.message);
  }
}
