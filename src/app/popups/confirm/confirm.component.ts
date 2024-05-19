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
  this.data.header.toLowerCase() === 'alert' ? '#0099ff' : '#0e2b6c';

  style = {
    "color": this.color,
    "fontWeight": 500
  }

  ngOnInit(): void {
    // console.log(this.data);
  }

  public close(isOk: boolean) {
    this.mdDialogRef.close(isOk);
  }
}

export interface ConfirmPopupData {
  header: string,
  message:string,
  showCancelButton?: boolean,
  tableType?: string,
  tableData?: any,
  modalMinWidth?: number,
  okButtonLabel?: string,
  cancelButtonLabel?: string
}

