import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DashboardPage } from './dashboard.page';
import { ExtractsComponent } from './extracts/extracts.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'main',
        component: MainComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'extracts',
        component: ExtractsComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
