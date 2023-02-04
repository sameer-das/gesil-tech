import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { DocumentPopupComponent } from '../document-popup/document-popup.component';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit, OnChanges {
  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
    private _popupService: PopupService,
    private _loaderService: LoaderService,
    private _matDialog: MatDialog
  ) { }
  @Input('states') states: any[] = [];
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  kycDetails: any = {};
  relations: any[] = [
    { id: 'father', name: 'Father' },
    { id: 'mother', name: 'Mother' },
    { id: 'spouse', name: 'Spouse' },
    { id: 'son', name: 'Son' },
    { id: 'daughter', name: 'Dauhgter' },
    { id: 'sibling', name: 'Sibling' },
  ];

  ngOnInit(): void {

    if (this.locationTypes.length === 0)
      this.getUserLocationType();
    this._authService
      .getUserRegistrationDetails(this.currentUser.user.user_ID)
      .subscribe({
        next: (resp: any) => {
          if (
            resp.status === 'Success' &&
            resp.code === 200 &&
            resp.data &&
            Object.keys(resp).length > 0
          ) {
            this.userRegDetails = resp.data;
            this.populateUserRegistrationForm(this.userRegDetails);
          }
        },
        error: (err) => {
          console.log(`Error fetching user registration detail`);
          console.error(err);
        },
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.states);
    if (this.states.length == 0) {
      console.log('call populate state');
      this.populateStates(1);
    }
  }

  onStepChange(e: StepperSelectionEvent) {
    if (e.selectedIndex === 1) {
      this.populateDistricts(this.currentUser.user.state_ID);
      // if (this.blocks.length == 0) this.populateBlocks();
      //fetch personal details
      if (Object.keys(this.userPersonalDetail).length == 0) {
        this._authService
          .getUserPersonalDetail(this.currentUser.user.user_ID)
          .subscribe({
            next: (resp: any) => {
              console.log(resp);
              if (
                resp.status === 'Success' &&
                resp.code === 200 &&
                resp.data &&
                Object.keys(resp).length > 0
              ) {
                this.userPersonalDetail = resp.data;
                this.currentChoosenStateId = this.userPersonalDetail.state_ID;
                this.currentChoosenDistrictId = this.userPersonalDetail.district_ID;
                // this.populateBlocks(this.userPersonalDetail.state_ID, this.userPersonalDetail.district_ID);
                this._authService.getBlocks(this.userPersonalDetail.state_ID, this.userPersonalDetail.district_ID).subscribe({
                  next: (resp: any) => {
                    if (resp.status === 'Success' && resp.code === 200) {
                      this.blocks = resp.data;
                      // cb(this.userPersonalDetail);
                      this.populateUserPersonalDetailForm(this.userPersonalDetail);
                    }
                  },
                  error: (err) => {
                    console.error(err);
                  },
                });
              }
            },

            error: (err) => {
              console.log(`error fetching user personal detail`);
              console.error(err);
            },
          });
      } else {
        this.populateUserPersonalDetailForm(this.userPersonalDetail);
      }
    } else if (e.selectedIndex === 2) {
      if (this.banks.length == 0) this.populateBanks();
      // fetch bank details
      if (Object.keys(this.userBankDetails).length === 0) {
        this._authService
          .getUserBankDetail(this.currentUser.user.user_ID)
          .subscribe({
            next: (resp: any) => {
              if (
                resp.status === 'Success' &&
                resp.code === 200 &&
                resp.data &&
                Object.keys(resp.data).length > 0
              ) {
                this.userBankDetails = resp.data;
                this.populateUserBankDetailForm(this.userBankDetails);
              }
            },
          });
      } else {
        this.populateUserBankDetailForm(this.userBankDetails);
      }
    } else if (e.selectedIndex === 3) {
      console.log('fetch kyc details')
      // if (Object.keys(this.userBankDetails).length === 0) {
      //   this._authService
      //     .getUserBankDetail(this.currentUser.user.user_ID)
      //     .subscribe({
      //       next: (resp: any) => {
      //         console.log(resp)
      //         if (
      //           resp.status === 'Success' &&
      //           resp.code === 200 &&
      //           resp.data &&
      //           Object.keys(resp.data).length > 0
      //         ) {
      //           this.userBankDetails = resp.data;
      //         }
      //       },
      //     });
      // }

      if (Object.keys(this.kycDetails).length === 0) {

        this._authService.getKycDetails(this.currentUser.user.user_ID).subscribe({
          next: (resp: any) => {
            console.log(resp)
            if (resp.status === 'Success' && resp.code === 200) {
              this.kycDetails = resp.data;
              this.populateKycDetailsFormGroup(this.kycDetails);
            }

          }, error: (error: any) => {
            console.log('error fetching kyc details')
            console.log(error);
          }
        })
      } else {
        this.populateKycDetailsFormGroup(this.kycDetails);
      }
    }
  }

  userRegistrationFormGroup: FormGroup = this._formBuilder.group({
    userType: new FormControl({
      value: '',
      disabled: true,
    }),
    refNo: new FormControl({
      value: '',
      disabled: true,
    }),
    locationType: new FormControl('', Validators.required),
    state: new FormControl(this.currentUser.user.state_ID, Validators.required),
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
    ifsc: new FormControl('', Validators.required),
    branchName: new FormControl(),
    accountNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
  });

  kycDetailsFormGroup: FormGroup = this._formBuilder.group({
    adhar_no: new FormControl('', [Validators.required]),
    pan_no: new FormControl('', [Validators.required]),
    bank_account_no: new FormControl('', [Validators.required]),
    gstin_no: new FormControl(''),
  });

  userRegDetails: any = {};
  populateUserRegistrationForm(userRegDetails: any) {
    this.userRegistrationFormGroup = this._formBuilder.group({
      userType: new FormControl({
        value: userRegDetails.user_Type_ID + '',
        disabled: true,
      }),
      refNo: new FormControl({
        value: userRegDetails.ref_Code,
        disabled: true,
      }),
      locationType: new FormControl(
        +userRegDetails.location_Type,
        Validators.required
      ),
      state: new FormControl(
        this.currentUser.user.state_ID,
        Validators.required
      ),
      mobile: new FormControl(userRegDetails.mobile_Number, [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      email: new FormControl(userRegDetails.user_EmailID, [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
      ]),
    });
  }

  userPersonalDetail: any = {};
  populateUserPersonalDetailForm(personalDetail: any) {
    this.personalDetailsFormGroup = this._formBuilder.group({
      firstName: new FormControl(
        personalDetail.user_FName,
        Validators.required
      ),
      lastName: new FormControl(personalDetail.user_LName, Validators.required),
      gender: new FormControl(personalDetail.user_Gender, Validators.required),
      dob: new FormControl(personalDetail.user_Dob, Validators.required),
      state: new FormControl(personalDetail.state_ID, Validators.required),
      district: new FormControl(
        personalDetail.district_ID,
        Validators.required
      ),
      block: new FormControl(personalDetail.block_ID, Validators.required),
      gpWard: new FormControl(personalDetail.user_GP, Validators.required),
      pin: new FormControl(personalDetail.user_Pin, [
        Validators.required,
        Validators.pattern('^[0-9]{6}$'),
      ]),
      nomineeName: new FormControl(
        personalDetail.user_Nomine_Name,
        Validators.required
      ),
      relationWithNominee: new FormControl(
        personalDetail.nomine_Relation,
        Validators.required
      ),
      nomineeContact: new FormControl(personalDetail.nomine_ContactNumber, [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
    });
  }

  userBankDetails: any = {};
  populateUserBankDetailForm(bankDetail: any) {
    this.bankDetailsFormGroup = this._formBuilder.group({
      bank_id: new FormControl(bankDetail.bank_ID, Validators.required),
      accountHolderName: new FormControl(
        bankDetail.userAccount_HolderName,
        Validators.required
      ),
      accountNumber: new FormControl(
        bankDetail.user_Account_Number,
        [Validators.required, Validators.pattern('^[0-9]*$')]
      ),
      ifsc: new FormControl(bankDetail.user_IFSCCode, Validators.required),
      branchName: new FormControl(bankDetail.user_BranchName),
    });
  }

  getUserRegistrationFormErrorMessage(field: string): string | null {
    const control: AbstractControl | null =
      this.userRegistrationFormGroup.get(field);
    if (control?.invalid) {
      // console.log(control.errors);
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

  snackBarConfig: MatSnackBarConfig = {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    duration: 3000,
    panelClass: 'snackbar_css',
  };

  submitUserRegistration() {
    const userRegData = {
      user_ID: this.currentUser.user.user_ID,
      user_Type_ID: this.currentUser.user.user_Type_ID,
      location_Type: this.userRegistrationFormGroup.value.locationType + "",
      state_ID: this.userRegistrationFormGroup.value.state,
      mobile_Number: this.userRegistrationFormGroup.value.mobile,
      user_EmailID: this.userRegistrationFormGroup.value.email,
      ref_Code: this.currentUser.user.ref_Code,
      status: this.currentUser.user.status,
      login_Code: this.currentUser.user.login_Code,
      login_Password: this.currentUser.user.login_Password,
      module_ID: this.currentUser.user.module_ID,
      personal_Details: this.currentUser.user.personal_Details,
      bank_Details: this.currentUser.user.bank_Details,
      kyC_details: this.currentUser.user.kyC_details,
    };
    console.log(userRegData);
    // mandar bhwomik

    this._authService.updateUserReglInfo(userRegData).subscribe({
      next: (resp) => {
        console.log(resp);
        if (resp.status === 'Success' && resp.code === 200) {
          this.userRegDetails = resp.data;
          this._popupService.openAlert({
            message: 'User registration details updated successfully!',
            header: 'Success',
          });

          this.populateUserRegistrationForm(this.userRegDetails);
          this.refreshUserDetailsInLocalStorage();
        }
      },
      error: (err) => {
        console.log(`Error while updating user reg details`);
        console.log(err);
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while updating user registration details!',
        });
      },
    });
  }

  submitUserPersonalDetails() {
    console.log(this.personalDetailsFormGroup.value);

    const userPersonalInfo = {
      user_psnal_ID: this.userPersonalDetail.user_psnal_ID,
      user_ID: this.currentUser.user_ID,
      user_FName: this.personalDetailsFormGroup.value.firstName,
      user_LName: this.personalDetailsFormGroup.value.lastName,
      user_Gender: this.personalDetailsFormGroup.value.gender,
      user_Dob: this.getDate(this.personalDetailsFormGroup.value.dob),
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
    this._authService.updateUserPersonalInfo(userPersonalInfo).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.code === 200 && resp.status === 'Success') {
          this.userPersonalDetail = resp.data;

          this.populateUserPersonalDetailForm(this.userPersonalDetail);
          this.populateDistricts(this.userPersonalDetail.state_ID);
          this.refreshUserDetailsInLocalStorage();
          // if (this.blocks.length == 0) this.populateBlocks();

          const state = this.states.filter(
            (x) => x.state_ID === this.userPersonalDetail.state_ID
          );
          console.log(state)
          if (state?.length > 0) {
            localStorage.setItem('user_state', JSON.stringify({ ...state[0], user_ID: this.userPersonalDetail.user_ID }));
          }

          this._popupService.openAlert({
            message: 'User personal details updated successfully!',
            header: 'Success',
          });
        }
      },
      error: (err) => {
        console.log(`Error while updating user personal details`);
        console.log(err);
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while updating user personal details!',
        });
      },
    });
  }

  getDate(date: Date | string) {
    const d = new Date(date).getTime() + 19800000;
    return new Date(d).toISOString();
  }

  submitBankDetails() {
    let bankDetails;
    let bankSaveObservable: Observable<any>;
    if (Object.keys(this.userBankDetails).length > 0) {
      //update
      bankDetails = {
        bank_Detail_Id: this.userBankDetails.bank_Detail_Id,
        user_ID: this.userBankDetails.user_ID,

        bank_ID: this.bankDetailsFormGroup.value.bank_id,
        userAccount_HolderName: this.bankDetailsFormGroup.value.accountHolderName,
        user_Account_Number: this.bankDetailsFormGroup.value.accountNumber,
        user_IFSCCode: this.bankDetailsFormGroup.value.ifsc,
        user_BranchName: this.bankDetailsFormGroup.value.branchName,
      };
      bankSaveObservable = this._authService.updateUserBankDetails(bankDetails);
    } else {
      //insert

      bankDetails = {
        bank_Detail_Id: 0,
        user_ID: this.currentUser.user.user_ID,

        bank_ID: this.bankDetailsFormGroup.value.bank_id,
        userAccount_HolderName: this.bankDetailsFormGroup.value.accountHolderName,
        user_Account_Number: this.bankDetailsFormGroup.value.accountNumber,
        user_IFSCCode: this.bankDetailsFormGroup.value.ifsc,
        user_BranchName: this.bankDetailsFormGroup.value.branchName,
      };

      bankSaveObservable = this._authService.saveUserBankDetails(bankDetails);
    }



    console.log(bankDetails);

    bankSaveObservable.subscribe({
      next: (resp: any) => {
        if (resp.code === 200 && resp.status === 'Success') {
          //For update only 
          if (Object.keys(this.userBankDetails).length > 0) {
            this.userBankDetails = resp.data;
            this.populateUserBankDetailForm(this.userBankDetails);
            this.refreshUserDetailsInLocalStorage();
          }

          this._popupService.openAlert({
            message: 'User bank details updated successfully!',
            header: 'Success',
          });
        }
      },
      error: (err) => {
        console.log(`error while saving user bank details`);
        console.error(err);
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while updating user bank details!',
        });
      },
    });
  }


  submitKYCDetails() {
    console.log(this.kycDetailsFormGroup.value);
    console.log(this.base64_file_data);
    this.saveKYCDetails();
  }

  saveKYCDetails() {


    const kycDetails = {
      kyC_ID: this.currentUser.kycDetail.kyC_ID,
      user_ID: this.currentUser.user.user_ID,
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

    if (!/^[0-9]*$/.test(this.kycDetailsFormGroup.value.adhar_no) || this.kycDetailsFormGroup.value.adhar_no.length != 12) {
      this._popupService.openAlert({
        header: 'Alert',
        message: 'Invalid adhar number! Please enter valid adhar number'
      })
      return;
    }


    this._loaderService.showLoader();
    this._authService.saveUserKycDetails(kycDetails).subscribe({
      next: (resp: any) => {
        this._loaderService.hideLoader();
        console.log(resp);
        if (resp.code === 200 && resp.status === 'Success') {
          this._popupService.openAlert({
            header: 'Success',
            message: 'Details saved successfully!'
          });

          if (kycDetails.passport_Photo) {
            this._authService.profilePicUpdate$.next();
          }

          // To re update 
          this._authService.getKycDetails(this.currentUser.user.user_ID).subscribe({
            next: (resp: any) => {
              console.log(resp)
              if (resp.status === 'Success' && resp.code === 200) {
                this.kycDetails = resp.data;
                this.populateKycDetailsFormGroup(this.kycDetails);
                this.refreshUserDetailsInLocalStorage();
              }

            }, error: (error: any) => {
              console.log('error fetching kyc details')
              console.log(error);
            }
          })

        } else {
        }
      },
      error: (err) => {
        this._loaderService.hideLoader();
        this._popupService.openAlert({
          header: 'Alert',
          message: 'Error saving the details!'
        })
        console.log(`error while saving user kyc details`);
        console.error(err);

      },
    });
  }


  populateKycDetailsFormGroup(kycDetails: any) {
    this.kycDetailsFormGroup =
      this._formBuilder.group({
        adhar_no: new FormControl(kycDetails.aadhar_Number, [Validators.required]),
        pan_no: new FormControl(kycDetails.pancard_Number, [Validators.required]),
        bank_account_no: new FormControl(this.userBankDetails.user_Account_Number, [Validators.required]),
        gstin_no: new FormControl(kycDetails.gsT_Number),
      });
  }

  districts: any[] = [];
  currentChoosenStateId!: number;
  onStateChange(e: MatSelectChange) {
    this.blocks = [];
    this.districts = [];
    this.currentChoosenStateId = e.value;
    this.populateDistricts(e.value);
  }
  currentChoosenDistrictId!: number;;
  onDistrictChange(e: MatSelectChange) {
    console.log(e.value);
    this.currentChoosenDistrictId = e.value;
    this.populateBlocks(this.currentChoosenStateId, this.currentChoosenDistrictId)
  }

  blocks: any[] = [];
  populateBlocks(stateId: number, districId: number) {
    this._authService.getBlocks(stateId, districId).subscribe({
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

  banks: any[] = [];
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
  getUserPersonalDetailsFormErrorMessage(field: string): string | null {
    const control: AbstractControl | null =
      this.personalDetailsFormGroup.get(field);
    // console.log(control, field)
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
    // console.log(control , field);
    if (control?.invalid) {
      if (control.hasError('required')) {
        if (field === 'bank_id') return 'Please select your bank!';
        if (field === 'accountHolderName')
          return "Please enter account holder's name!";
        if (field === 'accountNumber') return 'Please enter account number!';
        if (field === 'ifsc') return 'Please enter bank IFSC!';
      }
      if (control.hasError('pattern')) {
        if (field === 'accountNumber') return 'Please enter a valid AC number!';
      }
    }
    return null;
  }

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

  file_names: any = {
    adhar_front: '',
    adhar_back: '',
    pan: '',
    bank_passbook: '',
    pass_photo: '',
    gst_cert: '',
    center_indoor: '',
    center_outdoor: '',
  }

  handleUpload(e: Event, name: string) {
    console.log(name);
    const target: any = e.target;
    const file = target?.files[0];
    if (file && !this.isInvalidFile(file, name)) {
      this.file_names[name] = file.name;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.base64_file_data[name] = reader.result;
      };
    }
  }

  isInvalidFile(file: File, name: string): boolean {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this._snackBar.open(
        'Please upload jpeg/png formats only!',
        'Alert',
        this.snackBarConfig
      );
      this.remove_file(name);
      return true;
    }
    return false;
  }

  remove_file(name: string) {
    this.base64_file_data[name] = '';
    if (name === 'adhar_front') {
      this.adhar_front.nativeElement.value = '';
      this.file_names.adhar_front = '';
    } else if (name === 'adhar_back') {
      this.adhar_back.nativeElement.value = '';
      this.file_names.adhar_back = '';
    } else if (name === 'pan') {
      this.pan.nativeElement.value = '';
      this.file_names.pan = '';
    } else if (name === 'bank_passbook') {
      this.bank_passbook.nativeElement.value = '';
      this.file_names.bank_passbook = '';
    } else if (name === 'pass_photo') {
      this.pass_photo.nativeElement.value = '';
      this.file_names.pass_photo = '';
    } else if (name === 'gst_cert') {
      this.gst_cert.nativeElement.value = '';
      this.file_names.gst_cert = '';
    } else if (name === 'center_indoor') {
      this.center_indoor.nativeElement.value = '';
      this.file_names.center_indoor = '';
    } else if (name === 'center_outdoor') {
      this.center_outdoor.nativeElement.value = '';
      this.file_names.center_outdoor = '';
    }
  }


  showDocument(docName: string) {
    // console.log(docName)
    this._matDialog.open(DocumentPopupComponent, { data: docName })
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




  refreshUserDetailsInLocalStorage() {
    this._authService.getUserInfos(this.currentUser.user.user_ID).subscribe({
      next: (resp: any) => {
        console.log(resp);
        if (resp.status === 'Success' && resp.code === 200) {
          localStorage.setItem('auth', JSON.stringify({ ...resp.data }));
        }
      },
      error: (err) => {
        console.log('Error while fetching user infos in refreshUserDetailsInLocalStorage');
        console.error(err);
      },
    });
  }
}
