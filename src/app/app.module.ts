/* eslint-disable @typescript-eslint/naming-convention */
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppEffect } from './effects/app.effect';
import { DashboardEffect } from './effects/dashboard.effect';
import { LoginEffect } from './effects/login.effect';
import { ProfileEffect } from './effects/profile.effect';
import { RegistersEffect } from './effects/registers.effect';
import { DashboardInterceptor } from './interceptors/dashboard.interceptor';
import { SharedModule } from './shared.module';
import { organizeseStore } from './store/organizese.store';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  prefix: 'R$ ',
  suffix: '',
  precision: 2,
  align: 'left',
  allowNegative: true,
  decimal: ',',
  thousands: '.',
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ animated: false }),
    AppRoutingModule,
    SharedModule,
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(organizeseStore),
    StoreDevtoolsModule.instrument({ maxAge: 45 }),
    EffectsModule.forRoot([
      AppEffect,
      DashboardEffect,
      LoginEffect,
      ProfileEffect,
      RegistersEffect,
    ]),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: DashboardInterceptor, multi: true },
    { provide: DatePicker },
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
