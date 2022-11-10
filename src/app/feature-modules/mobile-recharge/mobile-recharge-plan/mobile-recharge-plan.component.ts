import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-mobile-recharge-plan',
  templateUrl: './mobile-recharge-plan.component.html',
  styleUrls: ['./mobile-recharge-plan.component.scss'],
})
export class MobileRechargePlanComponent implements OnInit {
  constructor(private _route: ActivatedRoute, private _router: Router) {}
  rechargePlans: any[] = [];
  ngOnInit(): void {
    this._route.data.subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.data.code === 200 && resp.data.status === 'Success') {
          const rechargePlans =
            resp?.data?.resultDt?.data?.rechargePlan?.rechargePlansDetails ||
            [];
          console.log(rechargePlans);
          this.rechargePlans = this.sortPlans(rechargePlans);
          console.log(this.rechargePlans)
        }
      },
    });
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
}
