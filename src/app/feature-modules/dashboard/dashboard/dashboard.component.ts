import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PinPopupComponent } from 'src/app/popups/pin-popup/pin-popup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(public dialog: MatDialog) {}
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  public ngOnInit(): void {}
  assetPath: string = 'assets/icons/';
  openDialog(name?: string) {
    console.log('Open dialog called')
    // if(name?.toLowerCase() === 'mobile recharge'){
    //   // this.dialog.open(MobileRechargePopupComponent)
    // }
    // const dialogRef = this.dialog.open(QuickMenuDialog);

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  getImagePath(imageName: string) {
    return `${this.assetPath}${imageName}`;
  }

  getRoutePath(path:string) {
    if(path === '/Mobile-Recharge')
      return path.toLowerCase();
    return `../bbps/service${path}`;
  }

  getState(service:any) {
    return {services_ID: service.services_ID ,services_Cat_ID: service.services_Cat_ID}
  }

  openPopup() {
    this.dialog.open(PinPopupComponent, {disableClose: true})
  }
}

@Component({
  selector: 'quick-menu-dialog',
  templateUrl: 'quick-menu-dialog.html',
})
export class QuickMenuDialog {}
