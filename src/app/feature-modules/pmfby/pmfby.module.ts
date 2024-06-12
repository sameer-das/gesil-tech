import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { PmfbyComponent } from './pmfby.component';
import { CommonModule } from '@angular/common';
import { UpdateKycModule } from '../account/update-profile/update-kyc/update-kyc.module';

const routes: Routes = [
  { path: '', component: PmfbyComponent, canActivate: [] },
];

@NgModule({
  declarations: [PmfbyComponent],
  imports: [CommonModule, MaterialModule,UpdateKycModule, RouterModule.forChild(routes)],
  providers: [],
  exports: [],
})
export class PmfbyModule {}
