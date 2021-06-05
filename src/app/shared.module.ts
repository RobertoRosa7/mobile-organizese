import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { AddRegistersComponent } from './components/add-registers/add-registers.component';
import { HighchartsComponent } from './components/highcharts/highcharts.component';
import { LoginComponent } from './components/login/login.component';
import { ModalComponent } from './components/modal/modal.component';
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
    HighchartsComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CurrencyMaskModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    CurrencyMaskModule,

    SidepanelComponent,
    WindowsHackerComponent,
    ModalComponent,
    LoginComponent,
    AddRegistersComponent,
    HighchartsComponent,
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
