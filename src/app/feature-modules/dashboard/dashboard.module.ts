import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MaterialModule } from '../../material.module';
import { MobileNumberSearchComponent } from '../mobile-recharge/mobile-number-search/mobile-number-search.component';
import { MobileRechargePlanComponent } from '../mobile-recharge/mobile-recharge-plan/mobile-recharge-plan.component';
import { CarouselComponent } from './carousel/carousel.component';
import {
  DashboardComponent,
  QuickMenuDialog
} from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent, QuickMenuDialog,
    CarouselComponent, 
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
  providers: []
})
export class DashboardModule {}
