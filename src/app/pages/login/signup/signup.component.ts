/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RESET_ERRORS } from 'src/app/actions/errors.actions';
import { actionsTypes, CREATE_USER } from 'src/app/actions/login.actions';
import { Signup } from 'src/app/interfaces/general';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public changeTexts = true;
  public isLoading = false;
  public isPasswordSame = false;
  public errors$: Observable<any>;

  public signup: FormGroup = this.formBuild.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
      confirmPassword: [''],
      keepConnect: [false],
    },
    { validator: this.checkPassword('password', 'confirmPassword') }
  );

  constructor(
    private formBuild: FormBuilder,
    private store: Store,
    private as: ActionsSubject,
    private toastController: ToastController,
    private router: NavController
  ) {}

  ngOnInit() {}

  ionViewDidLeave() {
    this.store.dispatch(RESET_ERRORS());
  }

  public async onSubmit(event: Event): Promise<any> {
    event.preventDefault();
    this.isLoading = true;

    const payload: Signup = {
      password: this.signup.value.password,
      email: this.signup.value.email,
      created_at: new Date().getTime() / 1000,
      verified: false,
    };

    this.store.dispatch(CREATE_USER({ payload }));

    this.errors$ = this.store
      .select(({ errors }: any) => ({
        error:
          errors.error.source === 'signup' ? errors.error.error : undefined,
      }))
      .pipe(
        map((states) => {
          if (states.error?.message) {
            this.isLoading = false;
          }
          return states;
        })
      );

    this.signup.valueChanges.subscribe(() =>
      this.store.dispatch(RESET_ERRORS())
    );

    const user = await this.onUser();

    if (user) {
      const toast = await this.createToast(
        'Usuário criado com sucesso - verifique se e-mail.'
      );
      await toast.present();
    }
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

  public checkboxChange(event: any): void {
    this.signup.get('keepConnect').patchValue(event.detail.checked);
  }

  private onUser(): Promise<string> {
    return new Promise((resolve) =>
      this.onActionsTypes(actionsTypes.CREATED_USER).subscribe(
        ({ payload }: any) => resolve(payload)
      )
    );
  }

  private async createToast(message: string): Promise<HTMLIonToastElement> {
    return await this.toastController.create({
      message,
      duration: 5000,
      position: 'bottom',
    });
  }

  private onActionsTypes(type: string): Observable<any> {
    return this.as.pipe(filter((a) => a.type === type));
  }
}
