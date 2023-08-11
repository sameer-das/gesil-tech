import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartConfiguration } from 'chart.js';
import { WalletService } from 'src/app/feature-modules/wallet/wallet.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-my-view',
  templateUrl: './my-view.component.html',
  styleUrls: ['./my-view.component.scss']
})
export class MyViewComponent implements OnInit {

  constructor(private _walletService:WalletService, private _loaderService: LoaderService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  currentBalance!: string;
  commissionBalance!: string;
  ngOnInit(): void {

    this._loaderService.showLoader();
    this._walletService.getWalletBalance(this.currentUser.user.user_EmailID).subscribe({
      next: (resp: any) => {
        this._loaderService.hideLoader();
        console.log(resp);
        if (resp.status === 'Success' && resp.code === 200) {
          const [walletBalance, commission] = resp.data.split(',');
          this.currentBalance = walletBalance;
          this.commissionBalance = commission;
        } else {
          this.currentBalance = 'Error'
        }

      },
      error: (err: any) => {
        this._loaderService.hideLoader();
        console.log(err);
        this.currentBalance = 'Error fetching the balance'
      }
    })
  }

  // line chart details
  public lineChartLegend = true;
  public lineChartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false
  };
  public lineChartData: ChartConfiguration<'line'>['data'] = {
      labels: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      datasets: [{
          data: [0,50,70,175,105,125,100],
          label: 'Credit',
          fill: true,
          tension: 0,
          borderColor: '#008000',
          backgroundColor: 'rgba(0, 128, 0,0.5)',
      },{
          data:  [20,70,100,175,305,225,170],
          label: 'Debit',
          fill: true,
          tension: 0,
          borderColor: '#ff499e',
          backgroundColor: 'rgba(255,73,158,0.5)'
      }]
  };


  // Pie Chart details
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position:'top'
      }
    }
  };
  public pieChartLabels = [ 'Pending', 'Success', 'Failed' ];
  public pieChartDatasets = [ {
    data: [ 300, 500, 100 ]
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];



}
