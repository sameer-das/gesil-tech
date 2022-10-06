import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupService } from 'src/app/popups/popup.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private _popup: PopupService
  ) {
    this._dialogRef.disableClose = true;
  }

  forgotPasswordFormGroup: FormGroup = new FormGroup({
    // mobile: new FormControl('', [
    //   Validators.required,
    //   Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
    // ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
    ]),
  });
  ngOnInit(): void {}

  closeRegDialog() {
    this._dialogRef.close();
  }

  getEmailError(): string | null {
    if (this.forgotPasswordFormGroup.invalid) {
      const control: AbstractControl | null =
        this.forgotPasswordFormGroup.get('email');
      if (control?.hasError('required'))
        return 'Please enter your registered email id!';
      if (control?.hasError('pattern')) return 'Please enter a valid email id!';
    }
    return null;
  }

  sendLink() {
    if (this.forgotPasswordFormGroup.invalid) return;

    console.log(this.forgotPasswordFormGroup.value);

    setTimeout(() => {
      this.closeRegDialog();
      this._popup.openAlert({
        header: 'Success',
        message:
          'Details for password recovery has been sent to your registered email id!',
      });
    }, 1000);
  }
}
