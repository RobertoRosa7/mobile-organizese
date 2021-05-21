import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';
import { RESET_ERRORS } from 'src/app/actions/errors.actions';
import { actionsTypes, SIGNIN } from '../../actions/login.actions';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() sendClose = new EventEmitter();
  public changeTexts = true;
  public isLoading = false;
  public errorText: string;
  public isError: boolean;

  public login: FormGroup = this.formBuild.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(24)],
    ],
    keepConnect: [false],
  });

  constructor(
    private formBuild: FormBuilder,
    private store: Store,
    private toastController: ToastController,
    private as: ActionsSubject
  ) {}

  ngOnInit() {}

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
        this.isError = true;
        this.errorText = err.message ? err.message : 'Sistema indisponível';
        this.isLoading = false;
      }
    });

    this.login.valueChanges.subscribe(() =>
      this.store.dispatch(RESET_ERRORS())
    );

    const token = await this.onToken();
    if (token) {
      const toast = await this.createToast('Login realizado com sucesso.');
      await toast.present();
      this.isLoading = false;
      this.sendClose.emit(true);
    }
  }

  public close(): void {
    this.sendClose.emit();
  }

  public checkboxChange(event: any): void {
    this.login.get('keepConnect').patchValue(event.detail.checked);
  }

  private async createToast(message: string): Promise<HTMLIonToastElement> {
    return this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
  }

  private onToken(): Promise<string> {
    return new Promise((resolve) => {
      this.onActionsTypes(actionsTypes.SET_TOKEN).subscribe(
        ({ payload }: any) => resolve(payload)
      );
    });
  }

  private onActionsTypes(type: string): Observable<any> {
    return this.as.pipe(filter((a) => a.type === type));
  }
}
