import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-advertise-popup-component',
  templateUrl: './advertise-popup-component.component.html',
  styleUrls: ['./advertise-popup-component.component.scss']
})
export class AdvertisePopupComponentComponent implements OnInit {

  constructor(private mdDialogRef: MatDialogRef<AdvertisePopupComponentComponent>) { }

  ngOnInit(): void {
  }

  close () {
    this.mdDialogRef.close ();
  }

}
