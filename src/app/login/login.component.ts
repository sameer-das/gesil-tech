import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { PopupService } from '../popups/popup.service';
import { AuthService } from '../services/auth.service';
import { ForgotPasswordComponent } from './forgot-password-dialog/forgot-password.component';
import { RegisterDialogNewComponent } from './register-dialog-new/register-dialog-new.component';
import { RegisterDialog } from './register-dialog/register-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _popupService: PopupService
  ) {}
  ngOnInit(): void {}

  loginForm: FormGroup = this._fb.group({
    userid: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  openSignupModal() {
    // console.log('open dialog');
    const dialogRef = this.dialog.open(RegisterDialogNewComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }


  onLogin() {
    console.log(this.loginForm.value);
    this._authService.login(this.loginForm.value).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.status === 'Success' && result.data) {
          this._authService.userDetails = result.data;

          this._authService.getUserInfos(result.data.user_ID).subscribe({
            next: (resp: any) => {
              console.log(resp);
              if (resp.status === 'Success' && resp.code === 200) {
                localStorage.setItem('auth', JSON.stringify(resp.data));
                localStorage.setItem('auth_token', 'xxxxxxxxxxxxxxxx');
                this._router.navigate(['dashboard']);
              } else {
                this._popupService.openAlert({
                  header: 'Fail',
                  message: 'Unable to loade user details!',
                });
              }
            },
            error: (err) => {
              console.log('Error while fetching user infos');
              console.error(err);
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Unable to loade user details!',
              });
            },
          });
        } else {
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Invalid userid and password!',
          });
        }
      },
      error: (err) => {
        console.log(err);
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while logging you in!',
        });
      },
    });
  }

  getLoginFormErrorMessage(field: string): string | null{
    const control = this.loginForm.get(field);
    if(control?.errors){
      if(control.hasError('required')){
        if(field === 'userid') return 'Please enter your user id to login!';
        if(field === 'password') return 'Please enter your password to login!';
      }
    }
    return null;
  }

  openForgotPasswordDialog(){
    this.dialog.open(ForgotPasswordComponent)
  }
}
