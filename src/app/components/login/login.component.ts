import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { actionsTypes, SIGNIN } from '../../actions/login.actions';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() sendClose = new EventEmitter();
  public changeTexts = true;
  public errors$: Observable<any>;

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

  ngOnInit() {
    this.errors$ = this.store.select(({ errors }: any) => ({
      errors: errors.error.error,
    }));
  }

  public async onSubmit(event: Event): Promise<any> {
    event.preventDefault();
    this.store.dispatch(SIGNIN({ payload: this.login.value }));
    const token = await this.onToken();
    if (token) {
      const toast = await this.createToast('Login realizado com sucesso.');
      await toast.present();
      this.sendClose.emit(true);
    }
  }

  public close(): void {
    this.sendClose.emit();
  }

  public checkboxChange(event: CustomEvent): void {
    this.login.get('keepConnect').patchValue(event.detail.checked);
  }

  private async createToast(message: string): Promise<HTMLIonToastElement> {
    return await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
  }

  private onToken(): Promise<string> {
    return new Promise((resolve) => {
      this.as
        ?.pipe(filter((a) => a.type === actionsTypes.SET_TOKEN))
        .subscribe(({ payload }: any) => resolve(payload));
    });
  }
}
