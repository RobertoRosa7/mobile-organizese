/* eslint-disable @typescript-eslint/naming-convention */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OwlModule } from 'ngx-owl-carousel';
import { CardsComponent } from 'src/app/components/cards/cards.component';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { SharedModule } from 'src/app/shared.module';
import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { MainComponent } from './main/main.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardPageRoutingModule,
    SharedModule,
    OwlModule,
  ],
  declarations: [
    DashboardPage,
    MainComponent,
    CardsComponent,
    PopoverComponent,
  ],
})
export class DashboardPageModule {}
