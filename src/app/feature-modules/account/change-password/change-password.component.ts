import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private _fb: FormBuilder, private _popupService: PopupService, private _authService: AuthService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  ngOnInit(): void {
  }

  changePasswordForm: FormGroup = this._fb.group({
    current: new FormControl('', Validators.required),
    new: new FormControl('', Validators.required),
    cnew: new FormControl('', Validators.required)
  });

  onSubmit(): void {
    console.log(this.changePasswordForm.value);
    if (this.changePasswordForm.value.new !== this.changePasswordForm.value.cnew) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Your passwords did not match! Please try again.'
      });
      this.changePasswordForm.controls['cnew'].setErrors(Validators.required)
    } else {
      this._authService.updatePassword(
        {
          "userId": this.currentUser.user.user_ID,
          "oldPwd": this.changePasswordForm.value.current,
          "newPwd": this.changePasswordForm.value.new,
        }).subscribe({
          next: (resp: any) => {
            console.log(resp);
            if (resp.status === 'Success' && resp.code === 200 && resp.data === 'Password updation successful') {
              this._popupService.openAlert({
                header: 'Success',
                message: 'Your password has been changed successfully!'
              })
              this.changePasswordForm.reset();
            } else if (resp.status === 'Success' && resp.code === 200 && resp.data === 'failed to update password') {
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Failed to update your password!'
              })
            }
          }, error: (error: any) => {
            console.log('Error updating password');
            console.log(error)
          }
        })
    }

  }

  formClear(): void {
    this.changePasswordForm.reset();
  }

}
