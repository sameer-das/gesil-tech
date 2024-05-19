import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from 'src/app/material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateKycComponent } from './update-kyc.component';




@NgModule({
  declarations: [
    UpdateKycComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [UpdateKycComponent]
})
export class UpdateKycModule { }