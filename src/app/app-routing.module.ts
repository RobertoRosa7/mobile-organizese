import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuards } from './guards/login-guards';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full',},
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule) },
  { path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardPageModule),
    canActivate: [LoginGuards]},
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule) },
  { path: '**', redirectTo: 'home', pathMatch: 'prefix' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
