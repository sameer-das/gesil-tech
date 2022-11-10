import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MobileRechargePopupComponent } from '../mobile-recharge-popup/mobile-recharge-popup.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(public dialog: MatDialog) {}

  public ngOnInit(): void {}

  openDialog(name?: string) {
    if(name?.toLowerCase() === 'mobile recharge'){
      this.dialog.open(MobileRechargePopupComponent)
    }
    // const dialogRef = this.dialog.open(QuickMenuDialog);

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }

  public quick_menus: any[] = [
    {
      name: 'Mobile Recharge',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/mobile.png',
      route: '/mobile-recharge'
    },
    {
      name: 'DTH',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/dth.png',
    },
    {
      name: 'Post Paid',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/postpaid.png',
    },
    {
      name: 'Electricty',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/electricity.png',
    },
    {
      name: 'Transfer',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/money-transfer.png',
    },
    // {
    //   name: 'Fastag',
    //   img:'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/fasttag.png'
    // },
    {
      name: 'Gas',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/gas.png',
    },
    {
      name: 'Land Line',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/landline.png',
    },
    {
      name: 'Loan',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/loan.png',
    },
    {
      name: 'APES',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Indo-Nepal',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/indo-nepal.png',
    },
  ];

  public all_services: any[] = [
    {
      name: 'Services',
      img: '/assets/icons/services.svg',
    },
    {
      name: 'Agriculture',
      img: '/assets/icons/agriculture.svg',
    },
    {
      name: 'Banking',
      img: '/assets/icons/banking.svg',
    },
    {
      name: 'Government',
      img: '/assets/icons/govt.svg',
    },
    {
      name: 'Insurance',
      img: '/assets/icons/insurance.png',
    },
    {
      name: 'Electricity',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/electricity.png',
    },
    {
      name: 'Fastag',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/fasttag.png',
    },
    {
      name: 'Telecom',
      img: '/assets/icons/telecom.png',
    },
    {
      name: 'Tax Payment',
      img: '/assets/icons/tax.png',
    },

    {
      name: 'DTH',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/dth.png',
    },
  ];

  public financial_services: any[] = [
    {
      name: 'Loan Repayment',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Hospital Fee',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Education Fee',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Municipal Taxes',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Housing Society',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
  ];

  public insurance: any[] = [
    {
      name: 'Health Insurance',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Life Insurance',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'General Insurance',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Vehicle Insurance',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Term Plans',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
  ];

  public adhar: any[] = [
    {
      name: 'New Adhar',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Print PVC',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
  ];

  public banking: any[] = [
    {
      name: 'AEPS',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'DMT',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
  ];

  public education: any[] = [
    {
      name: 'PGDCA',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'DCA',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Tally',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
    {
      name: 'Computer Basics',
      img: 'https://digitalseva.gskindia.org/DigitalSevaGsk/images/userdashboard/aeps.png',
    },
  ];
}

@Component({
  selector: 'quick-menu-dialog',
  templateUrl: 'quick-menu-dialog.html',
})
export class QuickMenuDialog {}
