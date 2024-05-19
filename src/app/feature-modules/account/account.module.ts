import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePinComponent } from './change-pin/change-pin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { DocumentPopupComponent } from './document-popup/document-popup.component';
import { UpdateKycModule } from './update-profile/update-kyc/update-kyc.module';


@NgModule({
  declarations: [
    AccountComponent,
    MyProfileComponent,
    ChangePasswordComponent,
    ChangePinComponent,
    UpdateProfileComponent,
    DocumentPopupComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    UpdateKycModule,
    RouterModule.forChild([{
      path:'', component: AccountComponent
    }])
  ],
  exports: []
})
export class MyaccountModule { }
