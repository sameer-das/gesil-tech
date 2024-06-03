import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private _router:Router, private _authService:AuthService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  full_name!: string;
  email_id!: string;

  downloadAPI: string = '/api/User/Download';
  imageSource!:string;

  ngOnInit(): void {
    // console.log(this.currentUser.user);
    // console.log(this.currentUser.personalDetail);
    this.full_name = `${this.currentUser.personalDetail.user_FName} ${this.currentUser.personalDetail.user_LName}`;
    this.email_id = this.currentUser.user.user_EmailID;
    this.getProfileImage();
    this._authService.profilePicUpdate$.subscribe({
      next: () => {
        console.log('Profile Pic Updated');
        this.getProfileImage();
      }
    })
  }

  public signOutEmit() {
    localStorage.clear();
    
    this._router.navigate(['login'])
  }


  private getProfileImage() {
    this._authService.getKycDetails(this.currentUser.user.user_ID).subscribe({
      next: (resp:any) => {
        this.imageSource = `${environment.service_base_url}${this.downloadAPI}?fileName=${resp.data.passport_Photo}`
      }
    })
  }

  onError(e:Event) {
    const el = <HTMLImageElement>e.target;
    el.src = 'assets/avatar/avatar.jpg';
  }
}
