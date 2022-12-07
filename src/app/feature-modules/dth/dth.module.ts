import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DthListComponent } from './dth-list/dth-list.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/dynamic-form/shared.module';



@NgModule({
  declarations: [
    DthListComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: DthListComponent },
    ])
  ]
})
export class DthModule { }
