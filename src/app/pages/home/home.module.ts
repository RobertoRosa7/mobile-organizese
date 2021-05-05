import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';

@NgModule({
  imports: [IonicModule, HomePageRoutingModule, SharedModule],
  declarations: [HomePage],
})
export class HomePageModule {}
