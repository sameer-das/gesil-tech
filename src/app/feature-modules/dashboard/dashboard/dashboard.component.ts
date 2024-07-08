import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AdvertisePopupComponentComponent } from 'src/app/login/advertise-popup-component/advertise-popup-component.component';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(private _popupService: PopupService, private _loaderService: LoaderService, 
    private _authService: AuthService,
    public dialog: MatDialog,) { }
  ngOnDestroy(): void {
    this.$destroy.next(true)
  }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  menu_categories: any = JSON.parse(localStorage.getItem('menu_categories') || '{}');
  $destroy: Subject<boolean> = new Subject();

  esebaNews: string = '';
  public ngOnInit(): void { 
    this._authService.getEsebaNews().pipe(takeUntil(this.$destroy)).subscribe({
      next: (resp:any) => {
        if(resp.status = "Success" && resp.code === 200) {
          this.esebaNews = resp.data;
          console.log(this.esebaNews)
        }
      }
    })
  }
  assetPath: string = 'assets/icons/newicons/';
  getImagePath(imageName: string) {
    return `${this.assetPath}${imageName}`;
  }

  notImplemented = ['AEPS', 'New-Adhar', 'Print-PVC', 'PGDCA', 'DCA', 'pan']
  getRoutePath(path: string) {
    if (path === '/Mobile-Recharge')
      return path.toLowerCase();

    if (this.notImplemented.includes(path?.substring(1)) || !path) {
      return '/dashboard';
    }

    return `../bbps/service${path ? path : '/'}`;
  }

  getState(service: any) {
    console.log(service)
    return { services_ID: service.services_ID, services_Cat_ID: service.services_Cat_ID }
  }

  onTileClick (service:any) {
    console.log(`setServiceDetails ==== service_id ${service.services_ID }, service_cat_id ${service.services_Cat_ID}`)
    sessionStorage.setItem('current_service', JSON.stringify({services_ID: service.services_ID, services_Cat_ID: service.services_Cat_ID    }));   
  }

  openAddPopup () {
    this.dialog.open(AdvertisePopupComponentComponent, {
      panelClass: 'ad-comp'
    });
  }

}

@Component({
  selector: 'quick-menu-dialog',
  templateUrl: 'quick-menu-dialog.html',
})
export class QuickMenuDialog { }
