import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { PmfbyComponent } from './pmfby.component';
import { CommonModule } from '@angular/common';
import { UpdateKycModule } from '../account/update-profile/update-kyc/update-kyc.module';
import { KycGuard } from 'src/app/services/kyc.guard';

const routes: Routes = [
  { path: '', component: PmfbyComponent, canActivate: [KycGuard] },
];

@NgModule({
  declarations: [PmfbyComponent],
  imports: [CommonModule, MaterialModule,UpdateKycModule, RouterModule.forChild(routes)],
  providers: [  ],
  exports: [],
})
export class PmfbyModule {}
