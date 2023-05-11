import { Component } from '@angular/core';
import { PopupService } from 'src/app/popups/popup.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private _popupService:PopupService) {}
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  menu_categories: any = JSON.parse(localStorage.getItem('menu_categories') || '{}');
  
  public ngOnInit(): void {}
  assetPath: string = 'assets/icons/newicons/';
  getImagePath(imageName: string) {
    return `${this.assetPath}${imageName}`;
  }

  notImplemented = ['AEPS','New-Adhar','Print-PVC','PGDCA','DCA']
  getRoutePath(path:string) {
    if(path === '/Mobile-Recharge')
      return path.toLowerCase();

    if(this.notImplemented.includes(path?.substring(1)) || !path){
      return '/dashboard';
    }

    return `../bbps/service${path ? path : '/'}`;
  }

  getState(service:any) {
    return {services_ID: service.services_ID ,services_Cat_ID: service.services_Cat_ID}
  }


  onTileClick(service: any){
    console.log(service);
    if(this.notImplemented.includes(service.route?.substring(1)) || !service.route) {
      this._popupService.openAlert({
        header:'Coming Soon',
        message: 'This service is under development.'
      })
    }
  }
}

@Component({
  selector: 'quick-menu-dialog',
  templateUrl: 'quick-menu-dialog.html',
})
export class QuickMenuDialog {}
