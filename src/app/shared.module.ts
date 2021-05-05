import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ModalComponent } from './components/modal/modal.component';
import { SidepanelComponent } from './components/sidepanel/sidepanel.component';
import { WindowsHackerComponent } from './components/windows-hacker/windows-hacker.component';
import { SigninComponent } from './pages/login/signin/signin.component';
import { Constants } from './services/constants';

@NgModule({
  declarations: [
    SidepanelComponent,
    WindowsHackerComponent,
    ModalComponent,
    LoginComponent,
    SigninComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SidepanelComponent,
    WindowsHackerComponent,
    ModalComponent,
    LoginComponent,
    SigninComponent,
  ],
  providers: [
    {
      provide: Constants,
    },
    {
      provide: FormBuilder,
    },
  ],
})
export class SharedModule {}
