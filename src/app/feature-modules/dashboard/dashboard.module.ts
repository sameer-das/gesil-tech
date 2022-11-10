import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import {
  DashboardComponent,
  QuickMenuDialog,
} from './dashboard/dashboard.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MobileRechargePopupComponent } from './mobile-recharge-popup/mobile-recharge-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MobileNumberSearchComponent } from '../mobile-recharge/mobile-number-search/mobile-number-search.component';
import { MobileRechargePlanComponent } from '../mobile-recharge/mobile-recharge-plan/mobile-recharge-plan.component';
import { MobileRechargeService } from './mobile-recharge.service';
import { HttpClientModule } from '@angular/common/http';
import { MobilePlanGuard, MobilePlanResolverService } from '../mobile-recharge/mobile-plan-resolver.service';

@NgModule({
  declarations: [DashboardComponent, QuickMenuDialog,
    CarouselComponent, MobileRechargePopupComponent, 
    MobileNumberSearchComponent, MobileRechargePlanComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    CarouselModule,
  ],
  providers: [MobileRechargeService, MobilePlanGuard, MobilePlanResolverService]
})
export class DashboardModule {}
