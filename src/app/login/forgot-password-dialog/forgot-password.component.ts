import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private _popup: PopupService,
    private _authService: AuthService
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

  disabled = false;
  buttonLable = 'Send';
  sendLink() {
    if (this.forgotPasswordFormGroup.invalid) return;

    console.log(this.forgotPasswordFormGroup.value);
    this.disabled = true;
    this.buttonLable = 'Sending...';
    this._authService
      .sendForgotPasswordMail(this.forgotPasswordFormGroup.value.email)
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          if (
            resp.status === 'Success' &&
            resp.code === 200
          ) {
            this.closeRegDialog();
            this._popup.openAlert({
              header: 'Success',
              message:
                'Your password has been reset. The updated password has been sent to your registered email and phone number.',
            });
            this.disabled = false;
            this.buttonLable = 'Send';
          } else if (
            resp.status === 'Fail' &&
            resp.code === 500 &&
            resp.data === 'There is no row at position 0.'
          ) {
            this._popup.openAlert({
              header: 'Alert',
              message:
                'Provided email is not registered with us! Please enter your registered email id!',
            });
            this.disabled = false;
            this.buttonLable = 'Send';
          } else if (resp.status === 'Success' && resp.code === 200) {
            this._popup.openAlert({
              header: 'Fail',
              message: JSON.stringify(resp.data),
            });
            this.disabled = false;
            this.buttonLable = 'Send';
          }
        },
        error: (err) => {
          console.log(`Error while sending mail to registered email id`);
          console.error(err);
          this._popup.openAlert({
            header: 'Fail',
            message:
              'Error while sending details! Please check with customer support!',
          });
          this.disabled = false;
          this.buttonLable = 'Send';
        },
      });
  }
}
