import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./feature-modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canLoad: [AuthGuardService],
      },
      {
        path: 'wallet',
        loadChildren: () =>
          import('./feature-modules/wallet/wallet.module').then(
            (m) => m.WalletModule
          ),
        canLoad: [AuthGuardService],
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./feature-modules/account/account.module').then(
            (m) => m.MyaccountModule
          ),
        canLoad: [AuthGuardService],
      },
      {
        path: 'mobile-recharge',
        loadChildren: () =>
          import(
            './feature-modules/mobile-recharge/mobile-recharge.module'
          ).then((m) => m.MobileRechargeModule),
        canLoad: [AuthGuardService],
      },
      {
        path: 'payment',
        loadChildren: () =>
          import(
            './feature-modules/paytm/paytm.module'
          ).then((m) => m.PaytmModule),
        canLoad: [AuthGuardService],
      },
      {
        path: 'dth',
        loadChildren: () =>
          import(
            './feature-modules/dth/dth.module'
          ).then((m) => m.DthModule),
        canLoad: [AuthGuardService],
      },
    ],
  },
  {
    path: 'forgot',
    loadChildren: () =>
      import('./feature-modules/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  // {
  //   path: '**',
  //   component: LoginComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
