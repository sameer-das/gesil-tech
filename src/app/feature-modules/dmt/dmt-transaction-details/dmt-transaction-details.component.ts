import { Component, Inject, inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dmt-transaction-details',
  templateUrl: './dmt-transaction-details.component.html',
  styleUrls: ['./dmt-transaction-details.component.scss']
})
export class DmtTransactionDetailsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private mdDialogRef: MatDialogRef<DmtTransactionDetailsComponent>) {
    // console.log(data)
   }

  ngOnInit(): void {
  }


  close() {
    this.mdDialogRef.close()
  }
}



@Pipe({
  name: 'torupees',
  pure: true
})
export class PaisaToRupeesPipe implements PipeTransform {

  transform(value: any, ...args: any[]) {
    return (value / 100).toFixed(2)
  }

}