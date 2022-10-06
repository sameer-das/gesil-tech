import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePinComponent } from './change-pin/change-pin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateProfileComponent } from './update-profile/update-profile.component';



@NgModule({
  declarations: [
    AccountComponent,
    MyProfileComponent,
    ChangePasswordComponent,
    ChangePinComponent,
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path:'', component: AccountComponent
    }])
  ]
})
export class MyaccountModule { }
