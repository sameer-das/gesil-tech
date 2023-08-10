import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyViewComponent } from './my-view/my-view.component';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    MyViewComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    RouterModule.forChild([
      {
        path: '',
        component: MyViewComponent,
      },
    ]),
  ]
})
export class MyViewModule { }
