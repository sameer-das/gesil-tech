import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AlertPopupData,
    private mdDialogRef: MatDialogRef<AlertComponent>
  ) {}

  color: string = this.data.header.toLowerCase() === 'success' ? '#32cd32':
  this.data.header.toLowerCase() === 'fail' ? '#ff4500' :
  this.data.header.toLowerCase() === 'alert' ? '#0099ff' : '#000';
  
  style = {
    "color": this.color
  }

  ngOnInit(): void {
    // console.log(this.data)
  }

  public close() {
    this.mdDialogRef.close();
  }
}

export interface AlertPopupData {
  header: string,
  message:string,
}
