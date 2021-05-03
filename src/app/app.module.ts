import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppEffect } from './effects/app.effect';
import { AppService } from './services/app.services';
import { Constants } from './services/constants';
import { SharedModule } from './shared.module';
import { organizeseStore } from './store/organizese.store';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    StoreModule.forRoot(organizeseStore),
    StoreDevtoolsModule.instrument({ maxAge: 45 }),
    EffectsModule.forRoot([AppEffect]),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
