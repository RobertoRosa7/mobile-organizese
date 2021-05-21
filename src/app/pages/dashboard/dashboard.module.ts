import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { SharedModule } from 'src/app/shared.module';
import { MainComponent } from './main/main.component';
import { CardsComponent } from 'src/app/components/cards/cards.component';
import { OwlModule } from 'ngx-owl-carousel';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';

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
