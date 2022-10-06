import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private _router:Router) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  full_name!: string;
  email_id!: string;
  ngOnInit(): void {
    // console.log(this.currentUser.user);
    // console.log(this.currentUser.personalDetail);
    this.full_name = `${this.currentUser.personalDetail.user_FName} ${this.currentUser.personalDetail.user_LName}`;
    this.email_id = this.currentUser.user.user_EmailID;
  }

  public signOutEmit() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth');
    
    this._router.navigate(['login'])
  }
}
