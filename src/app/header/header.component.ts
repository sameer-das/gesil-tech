import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit{
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

  constructor() {}
  ngOnInit(): void {
    this.full_name = `${this.currentUser.personalDetail.user_FName} ${this.currentUser.personalDetail.user_LName}`;
    this.email_id = this.currentUser.user.user_EmailID;
  }

  public openMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
    this.isShowSidebar.emit(this.isMenuOpened);
  }

  public signOut(): void {}

  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  full_name!: string;
  email_id!: string;

 
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
