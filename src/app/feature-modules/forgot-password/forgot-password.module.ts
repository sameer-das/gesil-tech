import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { ModalComponent } from 'src/app/modal/modal.component';
import OpenModalDirective from 'src/app/modal/open-modal.directive';
import ModalService from 'src/app/modal/modal.service';



@NgModule({
  
  declarations: [
    ForgotPasswordComponent,ModalComponent,OpenModalDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    
    RouterModule.forChild([{
      path:'', component: ForgotPasswordComponent
    }])
  ],
  providers: [ModalService]
})
export class ForgotPasswordModule { }
