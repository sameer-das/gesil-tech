import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MobileRechargeService } from '../mobile-recharge.service';
import { v4 as uuidv4 } from 'uuid';
import { PopupService } from 'src/app/popups/popup.service';
import { MatDialog } from '@angular/material/dialog';
import { PinPopupComponent } from 'src/app/popups/pin-popup/pin-popup.component';
import { LoaderService } from 'src/app/services/loader.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-mobile-recharge-plan',
  templateUrl: './mobile-recharge-plan.component.html',
  styleUrls: ['./mobile-recharge-plan.component.scss'],
})
export class MobileRechargePlanComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _router: Router, private _matDialog: MatDialog,
    private _mobileRechargeService: MobileRechargeService, private _popupService: PopupService,
    private _loaderService: LoaderService) { }
  rechargePlans: any[] = [];
  rawRechargePlans: any[] = []
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  mobile_search: any = JSON.parse(sessionStorage.getItem('mobile_search') || '{}');

  searchString: FormControl = new FormControl('');
  filteredPlan: any[] = [];

  ngOnInit(): void {
    this._route.data.subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.data.code === 200 && resp.data.status === 'Success' && resp.data.resultDt !== "") {
          const rechargePlans =
            resp?.data?.resultDt?.data?.rechargePlan?.rechargePlansDetails ||
            [];
          this.rawRechargePlans = resp?.data?.resultDt?.data?.rechargePlan?.rechargePlansDetails ||
          [];
          console.log(rechargePlans);
          this.rechargePlans = this.sortPlans(rechargePlans);
          console.log(this.rechargePlans)
        } else {
          this._popupService.openAlert({
            header: 'Alert',
            message: 'Problem fetching recharge plans, Please try after sometime!'
          });
          this._router.navigate(['mobile-recharge']);
        }
      },
    });


    this.searchString.valueChanges
      .pipe(startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        map(x => x.toLowerCase()))
      .subscribe({
        next: (val:string) => {
          console.log(val)
          if(val) {
            this.filteredPlan = this.rawRechargePlans.filter((plan) => {
              return String(plan.amount).toLowerCase().includes(val) || plan.description.toLowerCase().includes(val) || plan.validity.toLowerCase().includes(val)
            } )
          } else {
            this.filteredPlan = [];
          }
        }
      })
  }

  sortPlans(rechargePlans: any[]) {
    if (rechargePlans.length === 0) return [];

    const result: any[] = [];
    // iterate over rechargePlans
    rechargePlans.forEach((rechargePlan: any) => {
      // find if the array contains the current plan
      const x = result.find((curr) => curr.planName === rechargePlan.planName);
      // check if any object is there with current plan name
      if (x) {
        // if found the any object with current plan name then push current rechargPlan to plan array
        x.plans.push(rechargePlan);
      } else {
        // if any object with current plan name not found then create one object with current plan name and push to result array
        result.push({ planName: rechargePlan.planName, plans: [] });
      }
    });
    return result;
  }

  operatorList = [
    {
      "op": 1,
      "provider": "AirTel"
    },
    {
      "op": 604,
      "provider": "airtel up east"
    },
    {
      "op": 2,
      "provider": "BSNL"
    },
    {
      "op": 32,
      "provider": "BSNL Special"
    },
    {
      "op": 505,
      "provider": "DOCOMO RECHARGE"
    },
    {
      "op": 506,
      "provider": "DOCOMO SPECIAL"
    },
    {
      "op": 4,
      "provider": "Idea"
    },
    {
      "op": 167,
      "provider": "Jio"
    },
    {
      "op": 5,
      "provider": "Vodafone"
    }
  ]

  openPinDialog(amount: string) {
    const dialogRef = this._matDialog.open(PinPopupComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Pin Dialog closed ${result}`);
      if (result)
        this.onPlanSelect(amount);
    });
  }


  onPlanSelect(amount: string) {
    const mobile_search = JSON.parse(sessionStorage.getItem('mobile_search') || '{}');
    console.log(amount);
    console.log(mobile_search.currentOperator);
    console.log(mobile_search.currentMobileNumber);
    const operatorId = environment.PREPAID_RECHARGE_OPERATOR.find(x => x.provider.toLowerCase().trim() === mobile_search.currentOperator.toLowerCase().trim());
    console.log(operatorId);

    const rechargePayload = {
      "apiToken": "",
      "mn": mobile_search.currentMobileNumber + '',
      "op": operatorId?.op + '',
      "amt": amount + '',
      "reqid": uuidv4(),
      "field1": "",
      "field2": "",
      "serviceId": 1,
      "categoryId": 1,
      "userId": this.currentUser.user.user_EmailID
    };
    console.log(rechargePayload);
    this._loaderService.showLoader();
    this._mobileRechargeService.prepaidRecharge(rechargePayload).subscribe({
      next: (resp: any) => {
        this._loaderService.hideLoader();
        console.log(resp);
        let message;
        if (resp.data.includes('status')) {
          const data = JSON.parse(resp.data);
          message = data.remark;
        } else {
          message = resp.data;
        }
        this._popupService.openAlert({
          header: 'Alert',
          message: message
        })
        // route to first page
        this._router.navigate(['mobile-recharge']);
      },
      error: (err: any) => {
        this._loaderService.hideLoader();
        console.log(`error while calling eGSKMobileRecharge`)
        console.log(err)
      }
    })
  }

  goBackMobileSearchScreen() {
    this._router.navigate(['/mobile-recharge'])
  }
}
