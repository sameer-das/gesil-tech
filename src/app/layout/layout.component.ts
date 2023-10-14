import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  constructor() { }
  ngAfterViewInit(): void {
    this.sidenav.open()
  }

  ngOnInit(): void {
   
  }

  toggleSidebar(e:boolean) {
    e ? this.sidenav.open() : this.sidenav.close()
  }
}
