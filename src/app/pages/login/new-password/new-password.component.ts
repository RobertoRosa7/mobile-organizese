/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
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
    private fb: FormBuilder,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private router: NavController,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        switchMap((params: any) => {
          if (params.token) {
            this.token = params.token;
            return this.loginService.loginVerified({ token: params.token });
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        (res) => {
        this.notification('Token verificado!');
      },
        (err) => {
          console.log(err);
          // this.router.navigateForward('/');
          // this.notification(err.message);
        }
      );
  }

  public onSubmit(event: any): void {
    event.preventDefault();
    this.isLoading = true;
    this.loginService.resetPassword({
        password: this.formNewPassword.value.password,
        token: this.token,
      })
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.notification(res.message);
        },
        (err) => {
          this.isLoading = false;
          this.notification(err.message);
        }
      );
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

  private async notification(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }
}
