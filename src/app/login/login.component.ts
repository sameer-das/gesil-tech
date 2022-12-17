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
import { LoaderService } from '../services/loader.service';
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
    private _popupService: PopupService,
    private _loaderService: LoaderService
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

  buttonText: string = 'Login Securely';
  disabled: boolean = false;
  onLogin() {
    this._loaderService.showLoader();
    console.log(this.loginForm.value);
    this.buttonText = 'Loging you in';
    this.disabled = true;
    this._authService.login(this.loginForm.value).subscribe({
      next: (result: any) => {
        this._loaderService.hideLoader();
        console.log(result);
        if (result.status === 'Success' && result.data) {
          this._authService.userDetails = result.data;

          this._authService.getUserInfos(result.data.userDetais.user_ID).subscribe({
            next: (resp: any) => {
              console.log(resp);
              if (resp.status === 'Success' && resp.code === 200) {
                localStorage.setItem('auth', JSON.stringify({...resp.data, menuCategories: this.getFormattedServices(result.data)}));
                localStorage.setItem('auth_token', 'xxxxxxxxxxxxxxxx');
                this._router.navigate(['dashboard']);
              } else {
                this._popupService.openAlert({
                  header: 'Fail',
                  message: 'Unable to loade user details!',
                });
                this.buttonText = 'Login Securely';
                this.disabled = false;
              }
            },
            error: (err) => {
              console.log('Error while fetching user infos');
              console.error(err);
              this._popupService.openAlert({
                header: 'Fail',
                message: 'Unable to loade user details!',
              });
              this.buttonText = 'Login Securely';
              this.disabled = false;
            },
          });
        } else {
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Invalid userid and password!',
          });
          this.buttonText = 'Login Securely';
          this.disabled = false;
        }
      },
      error: (err) => {
        this._loaderService.hideLoader();
        console.log(err);
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while logging you in!',
        });
        this.buttonText = 'Login Securely';
        this.disabled = false;
      },
    });
  }

  getLoginFormErrorMessage(field: string): string | null {
    const control = this.loginForm.get(field);
    if (control?.errors) {
      if (control.hasError('required')) {
        if (field === 'userid') return 'Please enter your user id to login!';
        if (field === 'password') return 'Please enter your password to login!';
      }
    }
    return null;
  }

  openForgotPasswordDialog() {
    this.dialog.open(ForgotPasswordComponent);
  }

  eye_icon_text:string = 'visibility_off';
  showPassword: boolean = false;
  
  togglePasswordShow() {
    if(this.showPassword){
      this.showPassword = false;
      this.eye_icon_text = 'visibility';
    } else {
      this.showPassword = true;
      this.eye_icon_text = 'visibility_off';
    }
    // console.log(this.showPassword, this.eye_icon_text);
  }

  getFormattedServices(data: any){
    const categories = data.services.map((serv: any) => {
      return {...serv, 
        services: data.categories.filter((cat: any) => cat.services_ID === serv.services_ID) 
      }
    });

    console.log(categories);
    return categories;

  }
}
