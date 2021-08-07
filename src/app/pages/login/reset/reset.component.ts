import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  public isLoading: boolean;
  public errorText: string;
  public isError: boolean;

  public emailForm: FormGroup = this.formBuild.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private formBuild: FormBuilder,
    private loginService: LoginService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  public onSubmit(event): void {
    event.preventDefault();
    this.isLoading = true;
    this.loginService.mailToReset({ email: this.emailForm.value.email })
      .subscribe(
        (res) => {
          this.notification(res.message);
          this.isLoading = false;
        },
        (err) => {
          this.notification(err.message);
          this.isLoading = false;
        }
      );
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
