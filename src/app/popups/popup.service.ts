import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent, AlertPopupData } from './alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }
  
  openAlert(data: AlertPopupData){
    this.dialog.open(AlertComponent, {
      data
    });
  }
}
