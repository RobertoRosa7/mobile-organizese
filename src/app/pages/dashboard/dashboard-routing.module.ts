import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidepanelComponent } from 'src/app/components/sidepanel/sidepanel.component';
import { DashboardPage } from './dashboard.page';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: '',
        component: MainComponent,
      },
      {
        path: 'registers',
        component: SidepanelComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
