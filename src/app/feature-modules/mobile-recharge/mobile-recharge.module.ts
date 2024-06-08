import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MobileNumberSearchComponent } from './mobile-number-search/mobile-number-search.component';
import {
  MobilePlanGuard,
  MobilePlanResolverService,
} from './mobile-plan-resolver.service';
import { MobileRechargePlanComponent } from './mobile-recharge-plan/mobile-recharge-plan.component';
import { MobileRechargeService } from './mobile-recharge.service';

const routes: Routes = [
  { path: '', component: MobileNumberSearchComponent },
  {
    path: 'plans',
    component: MobileRechargePlanComponent,
    resolve: {
      data: MobilePlanResolverService,
    },
    canActivate: [, MobilePlanGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [MaterialModule, RouterModule.forChild(routes)],
  providers: [
    MobileRechargeService,
    MobilePlanResolverService,
    MobilePlanGuard,
  ],
  exports: [],
})
export class MobileRechargeModule {}
