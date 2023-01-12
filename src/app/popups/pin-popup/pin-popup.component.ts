import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pin-popup',
  templateUrl: './pin-popup.component.html',
  styleUrls: ['./pin-popup.component.scss']
})
export class PinPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PinPopupComponent>, private _authService: AuthService) { }


  pin!: string;
  disabled: boolean = false;
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  message!: string;
  ngOnInit(): void {
    console.log('on init')
  }

  closeDialog() {
    this.dialogRef.close('sameer')
  }

  validatePin() {
    if (this.pin && this.pin.length === 4) {
      console.log(this.pin);
      this.disabled = true;
      this.message = 'Validating ...'
      this._authService.validateTPin(this.currentUser.user.user_ID, this.pin).subscribe({
        next: (resp: any) => {
          console.log(resp)
          if (resp.status === 'Success' && resp.code === 200 && resp.data) {
            this.dialogRef.close(true);
          } else if (resp.status === 'Success' && resp.code === 200 && !resp.data) {
            // show invalid Pin message
            this.message = 'Invalid Pin!';
            this.pin = '';
            this.disabled = false;
          } else {
            this.pin = '';
            this.message = 'Unknown error occured, please contact support!';
            this.disabled = false;
          }
        },
        error: (err: any) => {
          this.pin = '';
          console.log(err);
          this.message = 'Error while validating Pin!';
          this.disabled = false;
        }

      })
      
    }
  }



}
