import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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
}

@Component({
  selector: 'quick-menu-dialog',
  templateUrl: 'quick-menu-dialog.html',
})
export class QuickMenuDialog {}
