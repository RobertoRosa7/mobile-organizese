import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SIGNIN } from '../../actions/login.actions';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() sendClose = new EventEmitter();
  public changeTexts = true;
  public errors$: Observable<any>;
  public sucess$: Observable<any>;

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
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.errors$ = this.store.select(({ errors }: any) => ({
      errors: errors.error.error,
    }));
  }

  public onSubmit(event: Event): void {
    event.preventDefault();
    this.store.dispatch(SIGNIN({ payload: this.login.value }));
    this.store
      .select(({ errors }: any) => ({ success: errors.success }))
      .subscribe(async (states) => {
        if (states.success === 'login') {
          console.log('bing');
          const toast = await this.createToast('Login realizado com sucesso.');
          await toast.present();
          this.sendClose.emit(true);
        }
      });
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
}
