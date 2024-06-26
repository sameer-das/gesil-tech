import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
// import * as moment from 'moment';

@Component({
  selector: 'app-register-dialog-new',
  templateUrl: './register-dialog-new.component.html',
  styleUrls: ['./register-dialog-new.component.scss'],
})
export class RegisterDialogNewComponent implements OnInit, OnDestroy {
  constructor(
    private _dialogRef: MatDialogRef<RegisterDialogNewComponent>,
    private _authService: AuthService,
    private _popupService: PopupService,
    private _loaderService: LoaderService
  ) {
    this._dialogRef.disableClose = true;
  }

  ngOnDestroy(): void {
    this.$destroy.next(true)
  }


  showRefForm: boolean = true;
  showRegistrationForm: boolean = false;
  showNoRefMessage: boolean = false;

  private $destroy: Subject<boolean> = new Subject();

  states: any[] = [];
  districts: any[] = [];
  blocks: any[] = [];

  stateId!: number;
  districtId!: number;

  acceptTnC: boolean = false;

  refNoFormGroup: FormGroup = new FormGroup({
    refNo: new FormControl('', Validators.required),
  });

  registrationFormGroup: FormGroup = new FormGroup({
    userType: new FormControl('2'),
    locationType: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    firstName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
    lastName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
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
    if (this.locationTypes.length === 0)
      this.getUserLocationType();
    // if (this.blocks.length === 0) {
    //   this.populateBlocks();
    // }

    this.registrationFormGroup.get('userType')?.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (val) => {
          if(+val === 1) {
            this._popupService.openAlert({
              header:'Alert', 
              message:'Some services are not available for End User. To use all the services, please register as e-Sathi.'
            })
          }
        }
      })
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
        if (resp.status === 'Success' && resp.code === 200 && resp.data.startsWith('S')) {
          this.showRefForm = false;
          this.showRegistrationForm = true;
          if(resp.data.split('|')[1] == '2') { // retailer can create only end-user
            this.registrationFormGroup.patchValue({userType: '1'});
            this.registrationFormGroup.get('userType')?.disable();
          } else if(resp.data.split('|')[1] == '3') { // Distribute can create only retailer
            this.registrationFormGroup.patchValue({userType: '2'});
            this.registrationFormGroup.get('userType')?.disable();
          } else {
            // its 5, Admin can create both retailer and end-user
          }
        } else if (resp.status === 'Success' && resp.code === 200 && resp.data === 'F') {
          this._popupService.openAlert({
            header: 'Alert',
            message: 'The reference number you have entered is invalid. Please use Admin reference code i.e. 555401005338 '
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
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while checking the reference number. Please try after sometime.'
        });
        this.disabled = false;
        this.buttonLable = 'Verify and Proceed';
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
    this.districtId = e.value;
    this.populateBlocks(this.stateId, this.districtId);
  }

  onStateChange(e: MatSelectChange) {
    this.stateId = e.value;
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
        if (field === 'firstName') return 'First name can contain only characters';
        if (field === 'lastName') return 'Last name can contain only characters';
      }
    }

    return null;
  }

  onRegistrationFormSubmit() {
    console.log(this.registrationFormGroup.value);
    console.log(this.refNoFormGroup.value.refNo);
    if (this.registrationFormGroup.invalid) return;

    const userRegData = {
      user_ID: 0,
      user_Type_ID: +this.registrationFormGroup.getRawValue().userType,
      location_Type: this.registrationFormGroup.value.locationType + "",
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
      user_Dob: this.getDate(this.registrationFormGroup.value.dob),
      ref_Code: this.refNoFormGroup.value.refNo
    };
    console.dir(userRegData);

    this._loaderService.showLoader();

    this._authService
      .saveUserRegistrationDetails(userRegData)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.status === 'Success' && resp.code === 200) {
          this._loaderService.hideLoader();
          if (JSON.parse(resp.data)[0]?.Result?.includes('already registered')) {
            this._popupService.openAlert({
              header: 'Fail',
              message: 'Provided Email ID or mobile number is already registered with us!',
            });
            return;
          }

          this._popupService.openAlert({
            header: 'Success',
            message: 'Thank you for registering with us! Login credentials has been sent to your registered Email ID and Mobile Number!',
          });
          this.closeRegDialog();

        } else {
          console.log(resp);
          this._loaderService.hideLoader();
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

  populateBlocks(stateId: number, districtId: number) {
    this._authService.getBlocks(stateId, districtId).subscribe({
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

  getDate(date: Date | string) {
    const d = new Date(date).getTime() + 19800000;
    return new Date(d).toISOString();
  }

  locationTypes: any[] = [];
  getUserLocationType() {
    this._authService.getUserLocationType().subscribe({
      next: (resp: any) => {
        if (resp.status === 'Success' && resp.code === 200) {
          this.locationTypes = resp.data;
        }
      }, error: (err: any) => {
        console.log('error getting user location Type');
        console.log(err);
      }
    })
  }

  onNoRefCodeClick() {
    console.log('no ref clicked');

    this.showRefForm = false;
    this.showNoRefMessage = true;
  }

  onNoRefBack() {
    this.showRefForm = true;
    this.showNoRefMessage = false;
    this.showRegistrationForm = false;
  }

  onNoRefProceed() {
    this.refNoFormGroup.setValue({
      'refNo': '555401005338'
    })

    this.showRefForm = false;
    this.showNoRefMessage = false;
    this.showRegistrationForm = true;
  }
}
