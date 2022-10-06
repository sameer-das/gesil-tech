import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit , OnChanges{

  constructor(private _authService: AuthService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  @Input('userState') userState: any;
  ngOnChanges() {
    console.log(this.userState)
  }
  ngOnInit(): void {
  
  }
  bankDetails:any[] =[];
  onTabChange(e: MatTabChangeEvent) {
    // console.log(e)
    if(e.index === 1) {
      this._authService.getUserBankDetail(this.currentUser.user.user_ID).subscribe({
        next: (resp:any) => {
          if(resp.status === 'Success' && resp.code === 200){
            this.bankDetails = resp.data || []; 
          }
          console.log(this.bankDetails);
        },
        error: (err) => {
          console.log(`error fetching user bank detail`);
          console.error(err);
        }
      })
    }
  }

  getUserBankDetails(){
    
  }
}
