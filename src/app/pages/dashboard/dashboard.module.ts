/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { OwlModule } from 'ngx-owl-carousel';
import { CardsEmptyComponent } from 'src/app/components/cards-empty/cards-empty.component';
import { CardsComponent } from 'src/app/components/cards/cards.component';
import { DataEmptyComponent } from 'src/app/components/data-empty/data-empty.component';
import { ExtractEmptyComponent } from 'src/app/components/extract-empty/extract-empty.component';
import { ExtractComponent } from 'src/app/components/extract/extract.component';
import { HighchartsEmptyComponent } from 'src/app/components/highcharts-empty/highcharts-empty.component';
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
    ExtractEmptyComponent,
    HighchartsEmptyComponent,
    DataEmptyComponent,
    CardsEmptyComponent
  ],
})
export class DashboardPageModule {}
