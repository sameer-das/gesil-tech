import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, finalize, map, startWith, takeUntil } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.scss']
})
export class MyTeamComponent implements OnInit {

  constructor(private _authService: AuthService,
    private _loaderService: LoaderService,
    private _popupService: PopupService
  ) { }
  reportDataAll: any = [];
  reportDataFiltered: any = [];
  private $destroy: Subject<boolean> = new Subject();
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  search: FormControl = new FormControl('');


  ngOnInit(): void {
    this._loaderService.showLoader()
    this._authService.getRetailerWiseUsers(this.currentUser.user.user_ID)
      .pipe(
        takeUntil(this.$destroy),
        finalize(() => this._loaderService.hideLoader()))
      .subscribe({
        next: (resp: any) => {
          console.log(resp)
          if (resp.status === 'Success' && resp.code === 200) {
            if(resp.data?.length > 0) {
              this.reportDataAll = resp.data?.map((curr: any) => {
                return { ...curr, 'payment_Per_Amount': curr['payment_Per_Amount'].toFixed(2) }
              });
              this.reportDataFiltered = this.reportDataAll;
            }

          } else {
            this._popupService.openAlert({
              header: 'Alert',
              message: 'Error while fetching user details'
            })
          }
        },
        error: (err: any) => {
          console.log(err)
          this._popupService.openAlert({
            header: 'Fail',
            message: err.message
          })
        }
      })

    this.search.valueChanges
      .pipe(startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map(c => c.trim().toLowerCase()))
      .subscribe({
        next: (val) => {
          // console.log(val)
          if(val.length > 0) {
            this.reportDataFiltered = this.reportDataAll.filter((curr: any) => {
              return curr.userName.toLowerCase().includes(val) || 
              curr.login_Code.toLowerCase().includes(val) ||
              curr.mobile_Number.toLowerCase().includes(val) ||
              curr.district_Name.toLowerCase().includes(val)
            })
          } else {
            this.reportDataFiltered = this.reportDataAll;
          }
        }
      })
  }


  close_search() {
      this.search.patchValue('')
  }

}
