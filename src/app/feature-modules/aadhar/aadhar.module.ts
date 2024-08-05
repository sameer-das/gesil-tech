import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule, Routes } from '@angular/router';
import { AadharCheckComponent } from './aadhar-check/aadhar-check.component';

const routes: Routes = [
  { path: '', component: AadharCheckComponent, canActivate: [] },
];

@NgModule({
  declarations: [AadharCheckComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,RouterModule.forChild(routes)
  ]
})
export class AadharModule { }
