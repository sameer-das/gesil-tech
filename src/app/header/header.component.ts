import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HeaderService } from './header.service';
import { AuthService } from '../services/auth.service';
import { PopupService } from '../popups/popup.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() isMenuOpened: boolean = false;
  @Output() isShowSidebar = new EventEmitter<boolean>();
  public user$: Observable<User> = of({
    name: 'John',
    lastName: 'Smith',
  });
  public emails$: Observable<Email[]> = of([
    { name: 'Jane Hew', time: '9:32', message: 'Hey! How is it going?' },
    {
      name: 'Lloyd Brown',
      time: '9:18',
      message: 'Check out my new Dashboard',
    },
    {
      name: 'Mark Winstein',
      time: '9:15',
      message: 'I want rearrange the appointment',
    },
    {
      name: 'Liana Dutti',
      time: '9:09',
      message: 'Good news from sale department',
    },
  ]);

  constructor(private _router: Router,
    private _headerService: HeaderService,
    private _authService: AuthService,
    private _popupService: PopupService) { }
  ngOnInit(): void {
    this.full_name = `${this.currentUser.personalDetail.user_FName} ${this.currentUser.personalDetail.user_LName}`;
    this.email_id = this.currentUser.user.user_EmailID;
    this.login_code = this.currentUser.user.login_Code;

    this._headerService.personalInfoChanged$.subscribe(() => {
      console.log('Name changed in header')
      this.currentUser = JSON.parse(localStorage.getItem('auth') || '{}');
      this.full_name = `${this.currentUser.personalDetail.user_FName} ${this.currentUser.personalDetail.user_LName}`;
    })


    this._authService.getUserVerifiedAdharDetail(this.currentUser.user.user_ID).subscribe({
      next: (resp: any) => {
        if (resp.status === 'Success' && resp.code === 200) {
          if (resp.data && JSON.parse(resp.data).data.aadhaar_number) {
            // Adhar is there
          } else {
            this.showKycUpdatePopup();
          }
        } else {
          this.showKycUpdatePopup();
        }
      }, error: (err) => {
        console.log('Error fetching adhar details')
        console.log(err)
      }
    })

  }

  public openMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
    this.isShowSidebar.emit(this.isMenuOpened);
  }

  public signOut(): void { }

  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  full_name!: string;
  email_id!: string;
  login_code!: string;

  showKycUpdatePopup() {
    this._popupService.openAlert({
      header: 'Alert',
      message: 'Please update your e-KYC to avail our services! To update the e-KYC please navigate to Update Profile tab under Account Menu'
    })
  }

}

interface Email {
  name: string;
  time: string;
  message: string;
}

interface User {
  name: string;
  lastName: string;
}


