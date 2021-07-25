/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { OwlModule } from 'ngx-owl-carousel';
import { CardsComponent } from 'src/app/components/cards/cards.component';
import { ExtractComponent } from 'src/app/components/extract/extract.component';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { SharedModule } from 'src/app/shared.module';
import { AboutComponent } from './about/about.component';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { ExtractsComponent } from './extracts/extracts.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardPageRoutingModule,
    SharedModule,
    OwlModule,
    NgxMaskModule.forChild(),
  ],
  declarations: [
    DashboardPage,
    MainComponent,
    CardsComponent,
    PopoverComponent,
    SettingsComponent,
    AboutComponent,
    ExtractsComponent,
    ExtractComponent,
    ProfileComponent,
  ],
})
export class DashboardPageModule {}
