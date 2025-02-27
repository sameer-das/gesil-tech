import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule, Routes } from '@angular/router';
import { AadharCheckComponent } from './aadhar-check/aadhar-check.component';
import { AadharEnrollmentFormComponent } from './aadhar-enrollment-form/aadhar-enrollment-form.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { AadharEnrollmentFormStepperComponent } from './aadhar-enrollment-form-stepper/aadhar-enrollment-form-stepper.component';
import { AadharService } from './aadhar.service';
const routes: Routes = [
  { path: '', component: AadharCheckComponent, canActivate: [] },
];

@NgModule({
  declarations: [AadharCheckComponent, AadharEnrollmentFormComponent, AadharEnrollmentFormStepperComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,RouterModule.forChild(routes),
    NgxMaterialTimepickerModule
  ],
  providers: [AadharService]
})
export class AadharModule { }
