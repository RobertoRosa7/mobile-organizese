import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
