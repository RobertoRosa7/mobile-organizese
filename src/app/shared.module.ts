import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AddRegistersComponent } from './components/add-registers/add-registers.component';
import { LoginComponent } from './components/login/login.component';
import { ModalComponent } from './components/modal/modal.component';
import { PopoverComponent } from './components/popover/popover.component';
import { SidepanelComponent } from './components/sidepanel/sidepanel.component';
import { WindowsHackerComponent } from './components/windows-hacker/windows-hacker.component';
import { Constants } from './services/constants';
@NgModule({
  declarations: [
    SidepanelComponent,
    WindowsHackerComponent,
    ModalComponent,
    LoginComponent,
    AddRegistersComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
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
    IonicModule,
    SidepanelComponent,
    WindowsHackerComponent,
    ModalComponent,
    LoginComponent,
    AddRegistersComponent,
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
