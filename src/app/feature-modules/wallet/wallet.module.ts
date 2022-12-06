import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletComponent } from './wallet/wallet.component';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';
import { WalletService } from './wallet.service';



@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild([
      {      path:'', component: WalletComponent    },
  ])
  ],
  providers: [WalletService]
})
export class WalletModule { }
