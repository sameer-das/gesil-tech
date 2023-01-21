import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit {
  constructor(private _authService: AuthService) {}
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  ngOnInit(): void {
    console.log('oninit');

    forkJoin({
      stateMaster: this._authService.getState(1),
      registrationDetail: this._authService.getUserRegistrationDetails(
        this.currentUser.user.user_ID
      ),
      personalDetail: this._authService.getUserPersonalDetail(
        this.currentUser.user.user_ID
      ),
    }).subscribe({
      next: (resp: any) => {
        if (
          resp.stateMaster.status === 'Success' &&
          resp.stateMaster.code === 200 &&
          resp.registrationDetail.status === 'Success' &&
          resp.registrationDetail.code === 200 &&
          resp.personalDetail.status === 'Success' &&
          resp.personalDetail.code === 200
        ) {
          this.registrationDetail =  resp.registrationDetail.data;
          this.personalDetail = resp.personalDetail.data;
          this.states = resp.stateMaster.data;
        }

        console.log(this.registrationDetail);
        console.log(this.personalDetail);
        console.log(this.states);

        const state: any[] = this.states.filter((x:any) => x.state_ID === this.personalDetail.state_ID);
        this.personalDetail.state_Name = state && state[0].state_Name || null;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  bankDetails: any = {};
  personalDetail: any = {};
  registrationDetail: any = {};
  kycDetails: any = {};
  states: [] = [];
  banks: [] = [];

  onTabChange(e: MatTabChangeEvent) {
    // console.log(e)
    if (e.index === 1) {
      forkJoin({
        bankMaster: this._authService.getBankMaster(),
        bankDetails:  this._authService.getUserBankDetail(this.currentUser.user.user_ID)
      })
      .subscribe({
          next: (resp: any) => {
            if (resp.bankMaster.status === 'Success' && resp.bankMaster.code === 200
            && resp.bankDetails.status === 'Success' && resp.bankDetails.code === 200
            ) {
              this.bankDetails = resp.bankDetails.data || {};
              this.banks = resp.bankMaster.data;
            }
            console.log(this.bankDetails);
            console.log(this.banks);
            if(Object.keys(this.bankDetails).length > 0) {
              const bank:any[] = this.banks.filter((x:any) => x.id === this.bankDetails.bank_ID);
              this.bankDetails.bank_Name = bank && bank[0].bank_Name || null;
            }

          },
          error: (err) => {
            console.log(`error fetching user bank detail`);
            console.error(err);
          },
        });
    } else if(e.index === 2) {
        this._authService.getKycDetails(this.currentUser.user.user_ID).subscribe({
          next: (resp:any) => {
            console.log(resp)
            if(resp.status === 'Success' && resp.code === 200){
              this.kycDetails = resp.data;
            }
          }, error: (error) => {
            console.log('Error while fetching Kyc detaiils');
            console.log(error)
          }
        })
    }
  }

  getUserBankDetails() {}
}
