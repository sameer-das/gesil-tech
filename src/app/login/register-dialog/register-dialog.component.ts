import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss'],
})
export class RegisterDialog implements OnInit {
  isLinear = false;
  public step: number = 0;
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _dialogRef: MatDialogRef<RegisterDialog>,
    private _popupService: PopupService
  ) {
    this._dialogRef.disableClose = true;
  }

  @ViewChild('stepper') stepper!: MatStepper;

  @ViewChild('adhar_front') adhar_front!: ElementRef;
  @ViewChild('adhar_back') adhar_back!: ElementRef;
  @ViewChild('pan') pan!: ElementRef;
  @ViewChild('bank_passbook') bank_passbook!: ElementRef;
  @ViewChild('pass_photo') pass_photo!: ElementRef;
  @ViewChild('gst_cert') gst_cert!: ElementRef;
  @ViewChild('center_indoor') center_indoor!: ElementRef;
  @ViewChild('center_outdoor') center_outdoor!: ElementRef;

  base64_file_data: any = {
    adhar_front: '',
    adhar_back: '',
    pan: '',
    bank_passbook: '',
    pass_photo: '',
    gst_cert: '',
    center_indoor: '',
    center_outdoor: '',
  };

  reg_userid!: number;

  userRegistrationFormGroup: FormGroup = this._formBuilder.group({
    userType: new FormControl('1'),
    refNo: new FormControl('', Validators.required),
    locationType: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
    ]),
  });
  personalDetailsFormGroup: FormGroup = this._formBuilder.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    gender: new FormControl('m', Validators.required),
    dob: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    block: new FormControl('', Validators.required),
    gpWard: new FormControl('', Validators.required),
    pin: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{6}$'),
    ]),
    nomineeName: new FormControl('', Validators.required),
    relationWithNominee: new FormControl('', Validators.required),
    nomineeContact: new FormControl('', [
      Validators.required,
      Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
    ]),
  });

  bankDetailsFormGroup: FormGroup = this._formBuilder.group({
    bank_id: new FormControl('', Validators.required),
    accountHolderName: new FormControl('', Validators.required),
    accountNumber: new FormControl('', Validators.required),
    ifsc: new FormControl('', Validators.required),
    branchName: new FormControl(),
  });

  kycDetailsFormGroup: FormGroup = this._formBuilder.group({
    adhar_no: new FormControl('', [Validators.required]),
    pan_no: new FormControl('', [Validators.required]),
    bank_account_no: new FormControl('', [Validators.required]),
    gstin_no: new FormControl(''),
  });

  states: any[] = [];
  districts: any[] = [];
  blocks: any[] = [];
  banks: any[] = [];

  ur_editable: boolean = true;
  pd_editable: boolean = false;
  bd_editable: boolean = true;
  kycd_editable: boolean = true;

  ur_completed: boolean = false;
  pd_completed: boolean = false;
  bd_completed: boolean = false;
  kycd_completed: boolean = false;

  relations: any[] = [
    {id:"father", name: 'Father'},
    {id:"mother", name: 'Mother'},
    {id:"spouse", name: 'Spouse'},
    {id:"son", name: 'Son'},
    {id:"daughter", name: 'Dauhgter'},
    {id:"sibling", name: 'Sibling'},
  ]

  ngOnInit(): void {
    // Fetch States
    if (this.states.length === 0) {
      this.populateStates(1);
    }

    if (this.blocks.length === 0) {
      // this.populateBlocks();
    }

    if (this.states.length === 0) {
      this.populateBanks();
    }
  }

  goForward() {
    this.stepper.next();
  }

  goBackward() {
    this.stepper.previous();
  }

  closeRegDialog(){
    // if(this.reg_userid){

    // }
    this._dialogRef.close();
  }

  onStateChange(e: MatSelectChange) {
    this.populateDistricts(e.value);
  }

  onDistrictChange(e: MatSelectChange) {
    console.log(e);
  }

  // populateBlocks() {
  //   this._authService.getBlocks(1).subscribe({
  //     next: (resp: any) => {
  //       if (resp.status === 'Success' && resp.code === 200) {
  //         this.blocks = resp.data;
  //       }
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     },
  //   });
  // }

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

  populateBanks() {
    this._authService.getBankMaster().subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.status === 'Success') this.banks = resp.data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  submitUserRegistration() {
    console.log(this.userRegistrationFormGroup);
    const userRegData = {
      user_ID: 0,
      user_Type_ID: 2,
      location_Type: this.userRegistrationFormGroup.value.locationType,
      state_ID: this.userRegistrationFormGroup.value.state,
      mobile_Number: this.userRegistrationFormGroup.value.mobile,
      user_EmailID: this.userRegistrationFormGroup.value.email,
      ref_Code: this.userRegistrationFormGroup.value.refNo,
      status: 'Y',
      login_Code: 'gskInd003',
      login_Password: 'test@123',
      module_ID: 1,
      personal_Details: '0',
      bank_Details: '0',
      kyC_details: '0',
    };

    this._authService
      .saveUserRegistrationDetails(userRegData)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.status === 'Success' && resp.code === 200) {
          // this._dialogRef.close();
          this.reg_userid = Number(resp.data);
          this._popupService.openAlert({
            header: 'Success',
            message: 'User registration details saved successfully!',
          });
          this.ur_editable = false;
          this.ur_completed = true;
          this.goForward();
        } else {
          console.log(resp);
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while saving user registration details!',
          });
        }
      });
  }

  submitUserPersonalDetails() {
    console.log(this.personalDetailsFormGroup.value);

    if (!this.reg_userid) {
      this._popupService.openAlert({
        header: 'Alert',
        message:
          'Please login and navigate to Profile menu to update the details!',
      });
      return;
    }

    const userPersonalInfo = {
      user_psnal_ID: 0,
      user_ID: this.reg_userid,
      user_FName: this.personalDetailsFormGroup.value.firstName,
      user_LName: this.personalDetailsFormGroup.value.lastName,
      user_Gender: this.personalDetailsFormGroup.value.gender,
      user_Dob: new Date(this.personalDetailsFormGroup.value.dob).toISOString(),
      state_ID: this.personalDetailsFormGroup.value.state,
      district_ID: this.personalDetailsFormGroup.value.district,
      block_ID: this.personalDetailsFormGroup.value.block,
      user_GP: this.personalDetailsFormGroup.value.gpWard,
      user_Pin: this.personalDetailsFormGroup.value.pin,
      user_Nomine_Name: this.personalDetailsFormGroup.value.nomineeName,
      nomine_Relation: this.personalDetailsFormGroup.value.relationWithNominee,
      nomine_ContactNumber: this.personalDetailsFormGroup.value.nomineeContact,
    };

    console.log(userPersonalInfo);

    // this._authService.saveUserPersonalInfo(userPersonalInfo).subscribe({
    //   next: (resp: any) => {
    //     if (resp.code === 200 && resp.status === 'Success') {
    //       this._popupService.openAlert({
    //         header: 'Success',
    //         message: 'User personal details saved successfully!',
    //       });
    //       this.pd_editable = false;
    //       this.pd_completed = true;
    //       this.goForward();
    //     } else {
    //       console.log(resp);
    //       this._popupService.openAlert({
    //         header: 'Fail',
    //         message: 'Error while saving user personal details!',
    //       });
    //     }
    //   },
    //   error: (err) => {
    //     console.log(`error while saving user personal details`);
    //     console.error(err);
    //     this._popupService.openAlert({
    //       header: 'Fail',
    //       message: 'Error while saving user personal details!',
    //     });
    //   },
    // });
  }

  submitBankDetails() {
    if (!this.reg_userid) {
      this._popupService.openAlert({
        header: 'Alert',
        message:
          'Please login and navigate to Profile menu to update the details!',
      });
      return;
    }
    const bankDetails = {
      bank_Detail_Id: 0,
      user_ID: this.reg_userid,
      bank_ID: this.bankDetailsFormGroup.value.bank_id,
      userAccount_HolderName: this.bankDetailsFormGroup.value.accountHolderName,
      user_Account_Number: this.bankDetailsFormGroup.value.accountNumber,
      user_IFSCCode: this.bankDetailsFormGroup.value.ifsc,
      user_BranchName: this.bankDetailsFormGroup.value.branchName,
    };
    console.log(bankDetails);

    // this._authService.saveUserBankDetails(bankDetails).subscribe({
    //   next: (resp: any) => {
    //     if (resp.code === 200 && resp.status === 'Success') {
    //       this._popupService.openAlert({
    //         header: 'Success',
    //         message: 'User bank details saved successfully!',
    //       });
    //       this.bd_editable = false;
    //       this.bd_completed = true;
    //       this.goForward();
    //     } else {
    //       console.log(resp);
    //       this._popupService.openAlert({
    //         header: 'Fail',
    //         message: 'Error while saving user bank details!',
    //       });
    //     }
    //   },
    //   error: (err) => {
    //     console.log(`error while saving user bank details`);
    //     console.error(err);
    //     this._popupService.openAlert({
    //       header: 'Fail',
    //       message: 'Error while saving user bank details!',
    //     });
    //   },
    // });
  }

  submitKYCDetails() {
    // console.log(this.kycDetailsFormGroup.value);
    // console.log(this.base64_file_data);

    if (!this.reg_userid) {
      this._popupService.openAlert({
        header: 'Alert',
        message:
          'Please login and navigate to Profile menu to update the details!',
      });
      return;
    }

    const kycDetails = {
      kyC_ID: 0,
      user_ID: this.reg_userid,
      aadhar_Number: this.kycDetailsFormGroup.value.adhar_no,
      aadhar_FontPhoto: this.base64_file_data.adhar_front,
      aadhar_BackPhoto: this.base64_file_data.adhar_back,
      pancard_Number: this.kycDetailsFormGroup.value.pan_no,
      pancard_Photo: this.base64_file_data.pan,
      passport_Photo: this.base64_file_data.pass_photo,
      gsT_Number: this.kycDetailsFormGroup.value.gstin_no,
      gsT_Photo: this.base64_file_data.gst_cert,
      center_IndoorPhoto: this.base64_file_data.center_indoor,
      center_OutDoorPhoto: this.base64_file_data.center_outdoor,
    };

    console.log(kycDetails);

    // this._authService.saveUserKycDetails(kycDetails).subscribe({
    //   next: (resp: any) => {
    //     console.log(resp);
    //     if (resp.code === 200 && resp.status === 'Success') {
    //       this._popupService.openAlert({
    //         header: 'Success',
    //         message: 'User KYC details updated successfully, Please login to continue!',
    //       });

    //       this._dialogRef.close();
    //     } else {
    //       this._popupService.openAlert({
    //         header: 'Fail',
    //         message: 'Error while saving user KYC details!',
    //       });
    //     }
    //   },
    //   error: (err) => {
    //     console.log(`error while saving user kyc details`);
    //     console.error(err);
    //     this._popupService.openAlert({
    //       header: 'Fail',
    //       message: 'Error while saving user KYC details!',
    //     });
    //   },
    // });
  }

  getUserRegistrationFormErrorMessage(field: string): string | null {
    const control: AbstractControl | null =
      this.userRegistrationFormGroup.get(field);
    if (control?.invalid) {
      if (control.hasError('required')) {
        if (field === 'refNo') return 'Please enter a reference number!';
        if (field === 'locationType') return 'Please select location type!';
        if (field === 'state') return 'Please select your state!';
        if (field === 'mobile') return 'Please enter mobile number!';
        if (field === 'email') return 'Please enter your email id!';
      }

      if (control.hasError('pattern')) {
        if (field === 'mobile') return 'Please enter a valid mobile number!';
        if (field === 'email') return 'Please enter a valid email id!';
      }
    }

    return null;
  }

  getUserPersonalDetailsFormErrorMessage(field: string): string | null {
    const control: AbstractControl | null =
      this.personalDetailsFormGroup.get(field);
    if (control?.invalid) {
      if (control.hasError('required')) {
        if (field === 'firstName') return 'Please enter first name!';
        if (field === 'lastName') return 'Please enter first name!';
        if (field === 'dob') return 'Please choose date of birth!';
        if (field === 'state') return 'Please choose your state!';
        if (field === 'district') return 'Please choose your district!';
        if (field === 'block') return 'Please choose your block!';
        if (field === 'gpWard') return 'Please choose your GP/WARD!';
        if (field === 'pin') return 'Please choose your PIN!';
        if (field === 'nomineeName') return 'Please enter nominee name!';
        if (field === 'relationWithNominee')
          return "Please choose the nominee's relation with you!";
        if (field === 'nomineeContact')
          return "Please enter nominee's contact number!";
      }

      if (control.hasError('pattern')) {
        if (field === 'pin')
          return 'PIN should be of 6 digits and can contain only numbers!';
        if (field === 'nomineeContact')
          return 'Please enter a valid mobile number!';
      }
    }
    return null;
  }

  getUserBankDetailsFormErrorMessage(field: string): string | null {
    const control: AbstractControl | null =
      this.bankDetailsFormGroup.get(field);
    if (control?.invalid) {
      if (control.hasError('required')) {
        if (field === 'bank_id') return 'Please select your bank!';
        if (field === 'accountHolderName')
          return "Please enter account holder's name!";
        if (field === 'accountNumber') return 'Please enter account number!';
        if (field === 'ifsc') return 'Please enter bank IFSC!';
      }
      // if (control.hasError('pattern')) {
      //   if (field === 'pin')
      //     return 'PIN should be of 6 digits and can contain only numbers!';
      //   if (field === 'nomineeContact')
      //     return 'Please enter a valid mobile number!';
      // }
    }
    return null;
  }

  handleUpload(e: Event, name: string) {
    console.log(name);
    const target: any = e.target;
    const file = target?.files[0];
    if (file && !this.isInvalidFile(file, name)) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64_file_data[name] = reader.result;
      };
    }
  }

  isInvalidFile(file: File, name: string): boolean {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Please upload jpeg/png formats only!',
      });
      this.remove_file(name);
      return true;
    }
    return false;
  }

  remove_file(name: string) {
    this.base64_file_data[name] = '';
    if (name === 'adhar_front') {
      this.adhar_front.nativeElement.value = '';
    } else if (name === 'adhar_back') {
      this.adhar_back.nativeElement.value = '';
    } else if (name === 'pan') {
      this.pan.nativeElement.value = '';
    } else if (name === 'bank_passbook') {
      this.bank_passbook.nativeElement.value = '';
    } else if (name === 'pass_photo') {
      this.pass_photo.nativeElement.value = '';
    } else if (name === 'gst_cert') {
      this.gst_cert.nativeElement.value = '';
    } else if (name === 'center_indoor') {
      this.center_indoor.nativeElement.value = '';
    } else if (name === 'center_outdoor') {
      this.center_outdoor.nativeElement.value = '';
    }
  }
}
