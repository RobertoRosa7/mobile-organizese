import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { LoginPage } from '../login.page';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent extends LoginPage implements OnInit {
  public errorText: string;
  public isError: boolean;

  public emailForm: FormGroup = this.formBuild.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    protected loginService: LoginService,
    protected toastController: ToastController,
    private formBuild: FormBuilder,
  ) {
    super(toastController, loginService);
  }

  ngOnInit() {}

  public onSubmit(event): void {
    event.preventDefault();
    this.setIsLoading(true);
    this.loginService.mailToReset({ email: this.emailForm.value.email })
      .subscribe({next: (res) => this.onSubmitSuccess(res), error: (err) => this.onsSubmitError(err)});
  }
}
