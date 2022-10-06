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
import { MobileRechargeService } from './mobile-recharge-popup/mobile-recharge.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardComponent, QuickMenuDialog, CarouselComponent, MobileRechargePopupComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    CarouselModule,
  ],
  providers: [MobileRechargeService]
})
export class DashboardModule {}
