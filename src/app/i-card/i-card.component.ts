import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-i-card',
  templateUrl: './i-card.component.html',
  styleUrls: ['./i-card.component.scss']
})
export class ICardComponent implements OnInit {

  constructor(private _authService: AuthService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  downloadAPI: string = '/api/User/Download';
  imageSource:string = '';
  fullname:string = ''
  id: string = '';

  @ViewChild('pdf', {static: false}) pdf!: ElementRef;

  ngOnInit(): void {
    this.fullname = `${this.currentUser?.personalDetail?.user_FName} ${this.currentUser?.personalDetail?.user_LName}` 
    this.id = this.currentUser?.user?.login_Code
    this._authService.getKycDetails(this.currentUser.user.user_ID).subscribe({
      next: (resp:any) => {
        this.imageSource = `${environment.service_base_url}${this.downloadAPI}?fileName=${resp?.data?.passport_Photo}`
      }
    })
  }

}
