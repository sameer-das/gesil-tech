import { Component, OnInit } from '@angular/core';
import { Subject, finalize, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-pmfby',
  templateUrl: './pmfby.component.html',
  styleUrls: ['./pmfby.component.scss']
})
export class PmfbyComponent implements OnInit {

  constructor(private _loaderService: LoaderService,
    private _authService: AuthService
  ) { }

  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  $destroy: Subject<boolean> = new Subject();
  pmfbyStatus: any;

  ngOnInit(): void {
    this.getPMFBYStatus();
  }


  getPMFBYStatus() {
    this._loaderService.showLoader();
    this._authService.getPmfbyStatus(this.currentUser.user.mobile_Number)
      .pipe(takeUntil(this.$destroy), finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: any) => {
          console.log(resp)
          if (resp.status === 'Success' && resp.code === 200) {
            if (resp.data.data?.index_id) {
              this.pmfbyStatus = resp.data;
              console.log(this.pmfbyStatus)
            }
          }
        }
      })
  }

}
