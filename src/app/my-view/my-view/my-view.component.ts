import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-my-view',
  templateUrl: './my-view.component.html',
  styleUrls: ['./my-view.component.scss']
})
export class MyViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
