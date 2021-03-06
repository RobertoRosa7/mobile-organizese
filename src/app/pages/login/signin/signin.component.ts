import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';
import { RESET_ERRORS } from 'src/app/actions/errors.actions';
import { LoginService } from 'src/app/services/login.service';
import { actionsTypes, SIGNIN } from '../../../actions/login.actions';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  @Output() sendClose = new EventEmitter();
  public changeTexts = true;
  public isLoading = false;
  public isLoadingVerify = false;
  public errors$: Observable<any>;
  public errorText: string;
  public isError: boolean;
  public isVerifiedEmail = true;
  public login: FormGroup = this.formBuild.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(24)],
    ],
    keepConnect: [false],
  });
  constructor(
    protected formBuild: FormBuilder,
    private store: Store,
    private as: ActionsSubject,
    private toastController: ToastController,
    private router: NavController,
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  public close(): void {
    this.sendClose.emit({ status: false });
  }

  public async onSubmit(event: Event): Promise<any> {
    event.preventDefault();
    this.isLoading = true;
    this.store.dispatch(SIGNIN({ payload: this.login.value }));
    const error$ = this.store
      .select(({ errors }: any) => ({
        error:
          errors.error.source === 'signin' ? errors.error.error : undefined,
      }))
      .pipe(
        map((state) => state.error),
        delay(2000)
      );

    error$.subscribe((err) => {
      if (err) {
        if (err.verified != null && !err.verified) {
          this.isVerifiedEmail = err.verified;
        }
        this.isError = true;
        this.errorText = err.message ? err.message : 'Sistema indispon??vel';
        this.isLoading = false;
      }
    });

    this.login.valueChanges.subscribe(() => {
      this.errorText = '';
      this.store.dispatch(RESET_ERRORS());
    });

    const payload = await this.onToken();

    if (payload) {
      const toast = await this.createToast('Login realizado com sucesso.');
      await toast.present();
      this.router.navigateForward('/dashboard');
    }
  }

  public checkboxChange(event: any): void {
    this.login.get('keepConnect').patchValue(event.detail.checked);
  }
  public verifiedEmail(): void {
    this.isError = false;
    this.isLoadingVerify = true;
    this.loginService.emailToVerified(this.login.value).subscribe({
      next: async (res) => {
        this.isLoadingVerify = false;
        this.isVerifiedEmail = true;
        const toast = await this.createToast(res.message);
        await toast.present();
      },
      error: (err) => {
        this.isError = true;
        this.isLoadingVerify = false;
        this.errorText = err.message ? err.message : 'Sistema indispon??vel';
      },
    });
  }

  private onToken(): Promise<string> {
    return new Promise((resolve) => {
      this.onActionsTypes(actionsTypes.SET_TOKEN).subscribe(
        ({ payload }: any) => resolve(payload)
      );
    });
  }

  private async createToast(message: string): Promise<HTMLIonToastElement> {
    return this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
    });
  }

  private onActionsTypes(type: string): Observable<any> {
    return this.as.pipe(filter((a) => a.type === type));
  }
}
