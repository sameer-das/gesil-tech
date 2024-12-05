import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { LoaderService } from '../services/loader.service';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-i-card',
  templateUrl: './i-card.component.html',
  styleUrls: ['./i-card.component.scss']
})
export class ICardComponent implements OnInit, OnDestroy {

  constructor(private _authService: AuthService, private _loaderService: LoaderService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  downloadAPI: string = '/api/User/Download';
  imageSource:string = '';
  fullname:string = ''
  id: string = '';
  private $destory: Subject<boolean> = new Subject();

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


  download () {
    this._loaderService.showLoader();
    this._authService.downloadIdcard (this.currentUser.user.user_ID)
    .pipe(takeUntil(this.$destory), finalize(() => this._loaderService.hideLoader()))
    .subscribe({
      next: (resp) => {
        saveAs(resp, `Idcard_${this.currentUser?.personalDetail?.user_FName}_${this.currentUser?.personalDetail?.user_LName}.pdf`);
      },
      error: (err) => {
        console.log(err);
        alert('Error downlaoding file!')
      }
    });
  }


  ngOnDestroy(): void {
      this.$destory.next(true);
  }

}
