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

  constructor(private _walletService: WalletService, private _loaderService: LoaderService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  currentBalance!: string;
  commissionBalance!: string;

  table3: any = [];
  table4: any = [];

  showLineChart: boolean = false;

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

    const email = this.currentUser.user.user_EmailID;
    this._walletService.myViewChart(email).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.code === 200 && resp.status === 'Success') {
          const data = JSON.parse(resp.data);
          console.log(data);
          this.table3 = data['Table3'];
          this.table4 = data['Table4'];
          this.processForPieChart(data['Table2']);
          this.processForLineChart(data['Table1']);
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  // line chart details
  public lineChartLegend = true;
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };
  public lineChartData!: ChartConfiguration<'line'>['data'];
  

  
  last7Days() {
    var result = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d.toISOString().split('T')[0].split('-').reverse().join('-'))
    }

    return result;
  }

  // Pie Chart details
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };
  public pieChartLabels = ['In Progress', 'Success', 'Failed'];
  public credit_pieChartDatasets = [{
    data: [100, 100, 100]
  }];
  public debit_pieChartDatasets = [{
    data: [0, 0, 0]
  }];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  loadCreditPieChart: boolean = false;
  loadDebitPieChart: boolean = false;

  processForPieChart(pieChartData: any) {

    // console.log(pieChartData);
    if (pieChartData.length > 0) {
      const credit = pieChartData.filter((curr: any) => {
        return curr.Wallet_transaction_type === "CREDIT"
      })
      // console.log(credit)
      const credit_inporogress = credit.find((curr: any) => curr.Wallet_transaction_Status === "Inprogress")?.count || 0;
      const credit_success = credit.find((curr: any) => curr.Wallet_transaction_Status === "TXN_SUCCES")?.count || 0;
      const credit_fail = credit.find((curr: any) => curr.Wallet_transaction_Status === "Failed")?.count || 0;
      // console.log(credit_inporogress, credit_success, credit_fail)
      this.credit_pieChartDatasets[0].data = [credit_inporogress, credit_success, credit_fail]
      this.loadCreditPieChart = true

      const debit = pieChartData.filter((curr: any) => {
        return curr.Wallet_transaction_type === "DEBIT"
      })
      // console.log(debit)
      const debit_inporogress = debit.find((curr: any) => curr.Wallet_transaction_Status === "Inprogress")?.count || 0;
      const debit_success = debit.find((curr: any) => curr.Wallet_transaction_Status === "TXN_SUCCES")?.count || 0;
      const debit_fail = debit.find((curr: any) => curr.Wallet_transaction_Status === "Failed")?.count || 0;
      // console.log(debit_inporogress, debit_success, debit_fail)
      this.debit_pieChartDatasets[0].data = [debit_inporogress, debit_success, debit_fail]
      this.loadDebitPieChart = true
    }
  }

  processForLineChart(data: any) {
    const last7DaysDate = this.last7Days();
    const last7DaysCredit: number[] = [];
    const last7DaysDebit: number[] = [];

    for (let i = 0; i < last7DaysDate.length; i++) {
      const found = data.filter((element: any) => {
        return last7DaysDate[i] === element.Wallet_transaction_Date;
      });
      // console.log(found)
      if (found.length > 0) {
        found.forEach((element: any) => {
          if (element.Wallet_transaction_type === 'CREDIT') {
            last7DaysCredit.push(element.TransactionDebitCount)
          } else if (element.Wallet_transaction_type === 'DEBIT') {
            last7DaysDebit.push(element.TransactionDebitCount)
          }
        });
      } else {
        last7DaysCredit.push(0)
        last7DaysDebit.push(0)
      }
    }

    // console.log(last7DaysDate)
    // console.log(last7DaysCredit)
    // console.log(last7DaysDebit)


    this.lineChartData = {
      labels: last7DaysDate,
      datasets: [{
        data: last7DaysCredit,
        label: 'Credit',
        fill: false,
        tension: 0,
        borderColor: '#008000',
        backgroundColor: 'rgba(0, 128, 0,0.5)',
      }, {
        data: last7DaysDebit,
        label: 'Debit',
        fill: false,
        tension: 0,
        borderColor: '#ff499e',
        backgroundColor: 'rgba(255,73,158,0.5)'
      }]
    };

    this.showLineChart = true;
  }

}
