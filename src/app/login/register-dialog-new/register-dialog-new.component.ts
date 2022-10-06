import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';
// import * as moment from 'moment';

@Component({
  selector: 'app-register-dialog-new',
  templateUrl: './register-dialog-new.component.html',
  styleUrls: ['./register-dialog-new.component.scss'],
})
export class RegisterDialogNewComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<RegisterDialogNewComponent>,
    private _authService: AuthService,
    private _popupService: PopupService
  ) {
    this._dialogRef.disableClose = true;
  }

  showRefForm: boolean = true;
  states: any[] = [];
  districts: any[] = [];
  blocks: any[] = [];

  refNoFormGroup: FormGroup = new FormGroup({
    refNo: new FormControl('', Validators.required),
  });

  registrationFormGroup: FormGroup = new FormGroup({
    userType: new FormControl('1'),
    locationType: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    block: new FormControl('', Validators.required),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
    ]),
    pin: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{6}$'),
    ]),
    dob: new FormControl('', Validators.required),
    gp: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    if (this.states.length === 0) {
      this.populateStates(1);
    }
    if (this.blocks.length === 0) {
      this.populateBlocks();
    }
  }

  disabled: boolean = false;
  buttonLable: string = 'Verify and Proceed';
  checkAndVerifyRefNo() {
    const refId: string = this.refNoFormGroup.value.refNo;
    if (!refId) return;

    console.log(refId);
    this.disabled = true;
    this.buttonLable = 'Verifying...';
    this._authService.checkRefId(refId).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.status === 'Success' && resp.code === 200 && resp.data === 'S') {
          this.showRefForm = false;
        } else if(resp.status === 'Success' && resp.code === 200 && resp.data === 'F'){
          this._popupService.openAlert({
            header: 'Alert',
            message: 'The reference number you have entered is invalid. Please use Admin reference code i.e. \'admin\'!'
          });
          this.disabled = false;
          this.buttonLable = 'Verify and Proceed';
        } else {
          console.log(`Error while calling check ref id URL`);
        console.error(resp);
        }
      },
      error: (err) => {
        console.log(`Error while calling check ref id URL`);
        console.error(err);
      },
    });
  }

  getRefNoError(): string | null {
    const control: AbstractControl | null = this.refNoFormGroup.get('refNo');
    if (control?.errors) {
      if (control?.hasError('required'))
        return 'Please enter reference number!';
    }
    return null;
  }

  closeRegDialog() {
    // if(this.reg_userid){

    // }
    this._dialogRef.close();
  }

  onDistrictChange(e: MatSelectChange) {
    console.log(e);
  }

  onStateChange(e: MatSelectChange) {
    this.populateDistricts(e.value);
  }

  getUserRegistrationFormErrorMessage(field: string): string | null {
    const control: AbstractControl | null =
      this.registrationFormGroup.get(field);
    if (control?.invalid) {
      if (control.hasError('required')) {
        if (field === 'locationType') return 'Please select location type!';
        if (field === 'state') return 'Please select your state!';
        if (field === 'district') return 'Please select your district!';
        if (field === 'block') return 'Please select your block!';
        if (field === 'mobile') return 'Please enter mobile number!';
        if (field === 'email') return 'Please enter your email id!';
        if (field === 'firstName') return 'Please enter your first name!';
        if (field === 'lastName') return 'Please enter your last name!';
        if (field === 'pin') return 'Please enter your PIN!';
        if (field === 'dob') return 'Please choose your Date of Birth!';
        if (field === 'gender') return 'Please choose your gender!';
        if (field === 'gp') return 'Please enter your GP/Ward!';
      }

      if (control.hasError('pattern')) {
        if (field === 'mobile') return 'Please enter a valid mobile number!';
        if (field === 'email') return 'Please enter a valid email id!';
        if (field === 'pin') return 'Please enter a valid PIN!';
      }
    }

    return null;
  }

  onRegistrationFormSubmit() {
    console.log(this.registrationFormGroup.value);
    if (this.registrationFormGroup.invalid) return;

    const userRegData = {
      user_ID: 0,
      user_Type_ID: +this.registrationFormGroup.value.userType,
      location_Type: this.registrationFormGroup.value.locationType,
      state_ID: +this.registrationFormGroup.value.state,
      mobile_Number: this.registrationFormGroup.value.mobile,
      user_EmailID: this.registrationFormGroup.value.email,
      status: 'N',
      login_Code: 'gskInd003',
      login_Password: 'test@123',
      user_FName: this.registrationFormGroup.value.firstName,
      user_LName: this.registrationFormGroup.value.lastName,
      user_Gender: this.registrationFormGroup.value.gender,
      district_ID: +this.registrationFormGroup.value.district,
      block_ID: +this.registrationFormGroup.value.block,
      user_Pin: this.registrationFormGroup.value.pin,
      user_GP: this.registrationFormGroup.value.gp,
      user_Dob: this.getFormattedDob(this.registrationFormGroup.value.dob),
    };
    console.dir(userRegData);

    this._authService
      .saveUserRegistrationDetails(userRegData)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.status === 'Success' && resp.code === 200) {
          // this._dialogRef.close();
          this.closeRegDialog();
          this._popupService.openAlert({
            header: 'Success',
            message: 'Thank you for registering with us! Login credentials has been sent to your registered Email ID and Mobile Number!',
          });
        } else {
          console.log(resp);
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while saving user registration details!',
          });
        }
      });
  }

  populateStates(countryId: number) {
    this._authService.getState(countryId).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        if (resp.status === 'Success') this.states = resp.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  populateDistricts(stateId: number) {
    this._authService.getDistrict(stateId).subscribe({
      next: (resp: any) => {
        if (resp.status === 'Success' && resp.code === 200) {
          this.districts = resp.data;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  populateBlocks() {
    this._authService.getBlocks(1).subscribe({
      next: (resp: any) => {
        if (resp.status === 'Success' && resp.code === 200) {
          this.blocks = resp.data;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getFormattedDob(dob: any) {
    return dob.toISOString();
    // // add 1 day to solve the -5.30 problem 
    // const date = moment(dob).add(1, 'd');
    // // console.log(date)
    // return date.toISOString()
  }
}
