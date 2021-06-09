/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { SettingsComponent } from './settings/settings.component';
import { VerticalTimelineModule } from 'angular-vertical-timeline';

registerLocaleData(localePt, 'pt');
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardPageRoutingModule,
    SharedModule,
    OwlModule,
    VerticalTimelineModule,
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
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
})
export class DashboardPageModule {}
