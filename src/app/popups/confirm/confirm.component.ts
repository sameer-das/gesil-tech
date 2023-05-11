import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  showCancelButton: boolean = true;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmPopupData,
    private mdDialogRef: MatDialogRef<ConfirmComponent>
  ) {}

  color: string = this.data.header.toLowerCase().includes('success') ? '#32cd32':
  this.data.header.toLowerCase() === 'fail' ? '#ff4500' :
  this.data.header.toLowerCase() === 'alert' ? '#0099ff' : '#000';

  style = {
    "color": this.color
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  public close(isOk: boolean) {
    this.mdDialogRef.close(isOk);
  }
}

export interface ConfirmPopupData {
  header: string,
  message:string,
  showCancelButton?: boolean,
  showTable?: boolean,
  tableData?: any,
  modalWidth?: number
}

