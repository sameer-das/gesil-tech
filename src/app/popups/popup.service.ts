import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertComponent, AlertPopupData } from './alert/alert.component';
import { ConfirmComponent, ConfirmPopupData } from './confirm/confirm.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  openAlert(data: AlertPopupData) {
    this.dialog.open(AlertComponent, {
      maxWidth: 500,
      minWidth: 300,
      data
    });
  }

  openConfirm(data: ConfirmPopupData): MatDialogRef<ConfirmComponent> {
    return this.dialog.open(ConfirmComponent, {
      disableClose: data.showCancelButton,
      maxWidth: 500,
      minWidth: data.modalMinWidth || 400,
      data
    });
  }
}
