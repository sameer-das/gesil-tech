import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ServiceCategoryComponent } from './feature-modules/dashboard/service-category/service-category.component';
import { CcavenueMobileComponent } from './ccavenue-mobile/ccavenue-mobile.component';
import { CcavenueMobileStatusComponent } from './ccavenue-mobile-status/ccavenue-mobile-status.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // For CC Avenue Mobile integration, dont remove below 2 lines
  { path: 'ccavenuemobile', component: CcavenueMobileComponent },
  { path: 'ccavenuemobilestatus', component: CcavenueMobileStatusComponent },

  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'Utility-Services',
        component: ServiceCategoryComponent
      },
      {
        path: 'Finacial-Services',
        component: ServiceCategoryComponent
      },
      {
        path: 'Insurance-Services',
        component: ServiceCategoryComponent
      },
      {
        path: 'Banking-Services',
        component: ServiceCategoryComponent
      },
      {
        path: 'Goverment-Services',
        component: ServiceCategoryComponent
      },
      {
        path: 'Educational-Services',
        component: ServiceCategoryComponent
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./feature-modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canLoad: [AuthGuardService],
      },
      {
        path: 'my-view',
        loadChildren: () =>
          import('./my-view/my-view.module').then(
            (m) => m.MyViewModule
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
        path: 'paymentcc',
        loadChildren: () =>
          import(
            './feature-modules/ccavenue/ccavenue.module'
          ).then((m) => m.CcavenueModule),
        canLoad: [AuthGuardService],
      },
      {
        path: 'bbps',
        loadChildren: () =>
          import(
            './feature-modules/bbps-services/bbps-services.module'
          ).then((m) => m.BbpsServicesModule),
        canLoad: [AuthGuardService],
      },
      {
        path: 'support',
        loadChildren: () =>
          import(
            './feature-modules/support/support.module'
          ).then((m) => m.SupportModule),
        canLoad: [AuthGuardService],
      },
      {
        path: 'dmtransfer',
        loadChildren: () =>
          import(
            './feature-modules/dmt/dmt.module'
          ).then((m) => m.DmtModule),
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
export class AppRoutingModule { }
