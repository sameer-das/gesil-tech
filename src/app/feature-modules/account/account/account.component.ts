
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  constructor(private _authService: AuthService) {}
  currentTab: number = 1;
  userState: any = JSON.parse(localStorage.getItem('user_state') || '{}');
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  states: any[] = [];


  ngOnInit(): void {
    console.log(this.userState);
    this.getUserState();
  }

  changeTab(tab: number) {
    this.currentTab = tab;
  }


  getUserState() {
    if (!('state_Name' in this.userState) ||
      this.currentUser.user.user_ID != this.userState.user_ID
      ) {
      // Fetch User State
      console.log('fetching states');
      this._authService.getState(1).subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (resp.status === 'Success' && resp.code === 200) {
            this.states = resp.data;
            const state = this.states.filter(
              (x) => x.state_ID === this.currentUser.personalDetail.state_ID
            );
            // console.log(state)
            if (state?.length > 0) {
              this.userState = state;
              localStorage.setItem('user_state', JSON.stringify({...state[0], user_ID: this.currentUser.user.user_ID}));
            }
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

}
