import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dmt-home',
  templateUrl: './dmt-home.component.html',
  styleUrls: ['./dmt-home.component.scss']
})
export class DmtHomeComponent implements OnInit  {
  constructor(private router:Router) { }
  routes = [
    {route:'/dmtransfer/send', ind: 0},
    {route:'/dmtransfer/addrecipient', ind: 1},
    {route:'/dmtransfer/addsender', ind: 2},
  ]
  ngOnInit(): void {
    console.log(this.router.url)
    if(this.router.url === '/dmtransfer/addsender')
      this.showNav = false;
  }
  activeIndex: number = 0;
  showNav:boolean = true;
}
