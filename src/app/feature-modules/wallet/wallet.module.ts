import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Wallet2Component, WalletComponent } from './wallet/wallet.component';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      {      path:'', component: WalletComponent    },
      {      path:'two', component: Wallet2Component    }
  ])
  ]
})
export class WalletModule { }
