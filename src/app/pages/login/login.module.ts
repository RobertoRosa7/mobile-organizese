import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared.module';
import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ResetComponent } from './reset/reset.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';

@NgModule({
  imports: [CommonModule, IonicModule, SharedModule, LoginPageRoutingModule],
  declarations: [
    LoginPage,
    SigninComponent,
    SignupComponent,
    ResetComponent,
    NewPasswordComponent,
    VerifyComponent,
  ],
})
export class LoginPageModule {}
