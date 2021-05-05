import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ResetComponent } from './reset/reset.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  {
    path: '',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'reset',
    component: ResetComponent,
  },
  {
    path: 'new_password',
    component: NewPasswordComponent,
  },
  {
    path: 'verify',
    component: VerifyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
