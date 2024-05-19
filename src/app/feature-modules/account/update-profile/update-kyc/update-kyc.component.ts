import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentPopupComponent } from '../../document-popup/document-popup.component';
import { PopupService } from 'src/app/popups/popup.service';
import { Subject, finalize, forkJoin, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderService } from 'src/app/header/header.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-update-kyc',
    templateUrl: './update-kyc.component.html',
    styleUrls: ['./update-kyc.component.scss']
})
export class UpdateKycComponent implements OnInit {


    // adharNo: string = '';

    bankAccountNo: string = '';
    gstnNo: string = '';
    education: any;

    adharNo: FormControl = new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(12)]);
    panNo: FormControl = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]);

    isAdharValidated: boolean = false;

    kycDetails: any = {};

    base64_file_data: any = {
        adhar_front: '',
        adhar_back: '',
        pan: '',
        bank_passbook: '',
        pass_photo: '',
        gst_cert: '',
        center_indoor: '',
        center_outdoor: '',
        education_certificate: ''
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
        education_certificate: ''
    }

    @Output() documentUploadedToPmbky: EventEmitter<any> = new EventEmitter()

    @ViewChild('adhar_front') adhar_front!: ElementRef;
    @ViewChild('adhar_back') adhar_back!: ElementRef;
    @ViewChild('pan') pan!: ElementRef;
    @ViewChild('bank_passbook') bank_passbook!: ElementRef;
    @ViewChild('pass_photo') pass_photo!: ElementRef;
    @ViewChild('gst_cert') gst_cert!: ElementRef;
    @ViewChild('center_indoor') center_indoor!: ElementRef;
    @ViewChild('center_outdoor') center_outdoor!: ElementRef;
    @ViewChild('education_certificate') education_certificate!: ElementRef;

    @Input('isGesil') isGesil?: boolean = true;

    currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
    $destroy: Subject<boolean> = new Subject();


    snackBarConfig: MatSnackBarConfig = {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'snackbar_css',
    };

    bankDetails: any;

    tooltipMessage = 'To update the details please navigate to Update Profile under Account Menu';

    education_options = [
        { label: 'Below Secondary (10th)', value: '<10' },
        { label: 'Secondary (10th Pass)', value: '10' },
        { label: 'Senior Secondary (12th Pass)', value: '12' },
        { label: 'Graduate or Equivalent', value: 'graduate' },
        { label: 'Post Graduate and Above (Or Equivalent)', value: 'post graduate' },
    ]
    constructor(private _matDialog: MatDialog,
        private _popupService: PopupService,
        private _loaderService: LoaderService,
        private _authService: AuthService,
        private _headerService: HeaderService,
        private _snackBar: MatSnackBar,
    ) { }

    isAdharAlreadyVerified: boolean = false;
    isPanAlreadyVerified: boolean = false;
    showVerifyAdharButton: boolean = false;
    showVerifyPanButton: boolean = false;


    isKycAdharAndVerifiedAdharMismatch: boolean = false;
    isKycPanAndVerifiedPanMismatch: boolean = false;

    adhar_client_id!: string;
    pan_clien_id!: string;

    adhar_otp!: string;
    adhar_verified_response: any;
    pan_verified_response: any;

    ngOnInit(): void {
        console.log('Oninit of UpdateKYC')

        this.adharNo.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(val => {
            // console.log('ADHAR : ' + val);
            if (this.isAdharAlreadyVerified) {
                // console.log(this.adhar_verified_response)
                if (val !== this.adhar_verified_response.aadhaar_number) {
                    // show generate otp button
                    this.showVerifyAdharButton = true;
                } else {
                    this.showVerifyAdharButton = false;
                }
            }
        })

        this.panNo.valueChanges.pipe(takeUntil(this.$destroy)).subscribe(val => {
            // console.log('PAN : ' + val);
            if (this.isPanAlreadyVerified) {
                // console.log(this.adhar_verified_response)
                if (val.toLowerCase() !== this.pan_verified_response?.pan_number.toLowerCase()) {
                    // show generate otp button
                    this.showVerifyPanButton = true;
                } else {
                    this.showVerifyPanButton = false;
                }
            }
        })








        forkJoin({
            bankMaster: this._authService.getBankMaster(),
            bankDetails: this._authService.getUserBankDetail(this.currentUser.user.user_ID),
            verifiedAdhar: this._authService.getUserVerifiedAdharDetail(this.currentUser.user.user_ID),
            verifiedPan: this._authService.getUserVerifiedPanDetail(this.currentUser.user.user_ID),
            kycDetails: this._authService.getKycDetails(this.currentUser.user.user_ID)
        }).pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (resp: any) => {
                    console.log(resp)

                    if (resp.bankMaster.status === 'Success' && resp.bankMaster.code === 200
                        && resp.bankDetails.status === 'Success' && resp.bankDetails.code === 200
                        && resp.verifiedAdhar.status === 'Success' && resp.verifiedAdhar.code === 200
                        && resp.verifiedPan.status === 'Success' && resp.verifiedPan.code === 200
                        && resp.kycDetails.status === 'Success' && resp.kycDetails.code === 200
                    ) {
                        this.kycDetails = resp.kycDetails.data;
                        this.populateKycDetailsFormGroup(this.kycDetails);
                        this.bankDetails = resp.bankDetails.data;

                        // Check if Adhar is verified or not 
                        this.adhar_verified_response = resp.verifiedAdhar.data ? JSON.parse(resp.verifiedAdhar.data).data : null;
                        this.isAdharAlreadyVerified = !!this.adhar_verified_response?.aadhaar_number;

                        // Check if PAN is verified or not 
                        this.pan_verified_response = resp.verifiedPan.data ? JSON.parse(resp.verifiedPan.data).data : null;
                        this.isPanAlreadyVerified = !!this.pan_verified_response?.pan_number;


                        // If Adhar verified then patch value in form and dont show verification button
                        if (this.isAdharAlreadyVerified) {
                            this.adharNo.patchValue(this.adhar_verified_response?.aadhaar_number);
                            this.showVerifyAdharButton = false;
                        } else {
                            this.showVerifyAdharButton = true;
                        }

                        // If PAN verified then patch value in form and dont show verification button
                        if (this.isPanAlreadyVerified) {
                            this.panNo.patchValue(this.pan_verified_response?.pan_number)
                            this.showVerifyPanButton = false;
                        } else {
                            this.showVerifyPanButton = true;
                        }

                        this.checkKycDetailsWithVerifiedAdharAndPanResponse();
                    }

                    if (this.bankDetails && Object.keys(this.bankDetails).length > 0) {
                        const bank: any[] = resp.bankMaster.data.filter((x: any) => x.id === this.bankDetails.bank_ID);
                        this.bankDetails.bank_Name = bank && bank[0].bank_Name || null;
                    }
                },
                error: (err) => {
                    console.log(`error fetching user bank detail`);
                    console.error(err);
                },
            });
    }

    handleUpload(e: Event, name: string) {
        console.log(name);
        const target: any = e.target;
        const file = target?.files[0];
        URL.createObjectURL(file)
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
        } else if (name === 'education_certificate') {
            this.education_certificate.nativeElement.value = '';
            this.file_names.education_certificate = '';
        }
    }


    showDocument(docName: string) {
        // console.log(docName)
        this._matDialog.open(DocumentPopupComponent, { data: docName, width: '600px', height: '400px' })
    }

    validateAdhar() {
        if (!/^[0-9]*$/.test(this.adharNo.value) || this.adharNo.value.length != 12) {
            this._popupService.openAlert({
                header: 'Alert',
                message: 'Invalid adhar number! Please enter valid adhar number'
            })
            return;
        }

        this._popupService.openConfirm({
            message: `Please confirm if the adhar no. ${this.adharNo.value} is correct and belongs to you. This will be validated against UIDAI records.`,
            header: 'Confirm Adhar Number',
            showCancelButton: true,
            okButtonLabel: 'Confirm',
        })
            .afterClosed()
            .pipe(takeUntil(this.$destroy))
            .subscribe({
                next: (ok) => {
                    if (ok) {
                        this._loaderService.showLoader();
                        this._authService.getAdharDetails({
                            "adharaNumber": this.adharNo.value,
                            "userId": this.currentUser.user.user_ID
                        })
                            .pipe(takeUntil(this.$destroy), finalize(() => { this._loaderService.hideLoader() }))
                            .subscribe({
                                next: (adharResponse: any) => {
                                    console.log(adharResponse);
                                    if (adharResponse.code === 200 && adharResponse.status === "Success" && adharResponse?.data?.data) {
                                        this.isAdharValidated = true;
                                        this._popupService.openAlert({
                                            header: 'Success',
                                            message: 'Adhar has been validated successfully.'
                                        })
                                    } else {
                                        this.isAdharValidated = false;
                                        this._popupService.openAlert({
                                            header: 'Fail',
                                            message: 'Adhar could not be validated.'
                                        })
                                    }
                                },
                                error: (err) => {
                                    this.isAdharValidated = false;
                                    console.log('Error while validating Adhar');
                                    console.log(err);
                                    this._popupService.openAlert({
                                        header: 'Fail',
                                        message: 'Error while validating adhar. Please try after sometime.'
                                    })
                                }
                            })
                    }
                }
            })
    }



    populateKycDetailsFormGroup(kycDetails: any) {
        this.gstnNo = kycDetails.gsT_Number;
    }


    refreshUserDetailsInLocalStorage(type?: string) {
        this._authService.getUserInfos(this.currentUser.user.user_ID).subscribe({
            next: (resp: any) => {
                console.log(resp);
                if (resp.status === 'Success' && resp.code === 200) {
                    localStorage.setItem('auth', JSON.stringify({ ...resp.data }));
                    this.currentUser = JSON.parse(localStorage.getItem('auth') || '{}');
                    if (type === 'personalDetail') {
                        console.log('Refresh for personal change')
                        this._headerService.personalInfoChanged$.next();
                    }
                }
            },
            error: (err) => {
                console.log('Error while fetching user infos in refreshUserDetailsInLocalStorage');
                console.error(err);
            },
        });
    }


    updateKyc(type: string) {

        let kycDetails: any;
        switch (type) {
            case 'adhar': {
                console.log(this.adharNo.value);
                console.log(this.base64_file_data);
                if (!/^[0-9]*$/.test(this.adharNo.value) || this.adharNo.value.length != 12) {
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: 'Invalid adhar number! Please enter valid adhar number'
                    })
                    return;
                } else if (!this.base64_file_data.adhar_front || !this.base64_file_data.adhar_back) {
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: 'Please upload Adhar front side and back side photos.'
                    })
                    return;
                }

                kycDetails = {
                    kyC_ID: this.currentUser.kycDetail.kyC_ID,
                    user_ID: this.currentUser.user.user_ID,
                    aadhar_Number: this.adharNo.value,
                    aadhar_FontPhoto: this.base64_file_data.adhar_front,
                    aadhar_BackPhoto: this.base64_file_data.adhar_back,
                    pancard_Number: "",
                    pancard_Photo: "",
                    passport_Photo: "",
                    gsT_Number: "",
                    gsT_Photo: "",
                    center_IndoorPhoto: "",
                    center_OutDoorPhoto: "",
                    user_Education: "",
                    education_Photo: ""
                };
                break;
            }
            case 'pan': {
                console.log(this.base64_file_data);
                if (!/^[a-zA-Z0-9]+$/.test(this.panNo.value) || this.panNo.value.length !== 10) {
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: 'Invalid PAN! Please enter valid PAN.'
                    })
                    return;
                }

                if (!this.base64_file_data.pan) {
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: 'Please upload PAN photo.'
                    })
                    return;
                }

                kycDetails = {
                    kyC_ID: this.currentUser.kycDetail.kyC_ID,
                    user_ID: this.currentUser.user.user_ID,
                    aadhar_Number: "",
                    aadhar_FontPhoto: "",
                    aadhar_BackPhoto: "",
                    pancard_Number: this.panNo.value,
                    pancard_Photo: this.base64_file_data.pan,
                    passport_Photo: "",
                    gsT_Number: "",
                    gsT_Photo: "",
                    center_IndoorPhoto: "",
                    center_OutDoorPhoto: "",
                    user_Education: "",
                    education_Photo: ""
                };
                break;
            }

            case 'userphoto': {
                console.log(this.base64_file_data);
                if (!this.base64_file_data.pass_photo) {
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: 'Please upload a photo of the user.'
                    })
                    return;
                }
                kycDetails = {
                    kyC_ID: this.currentUser.kycDetail.kyC_ID,
                    user_ID: this.currentUser.user.user_ID,
                    aadhar_Number: "",
                    aadhar_FontPhoto: "",
                    aadhar_BackPhoto: "",
                    pancard_Number: "",
                    pancard_Photo: "",
                    passport_Photo: this.base64_file_data.pass_photo,
                    gsT_Number: "",
                    gsT_Photo: "",
                    center_IndoorPhoto: "",
                    center_OutDoorPhoto: "",
                    user_Education: "",
                    education_Photo: ""
                };
                break;
            }

            case 'gstn': {
                console.log(this.base64_file_data);
                if (!/^[a-zA-Z0-9]+$/.test(this.gstnNo) || this.gstnNo.length !== 15) {
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: 'Invalid GSTN! Please enter valid GSTN.'
                    })
                    return;
                }

                if (!this.base64_file_data.gsT_Photo) {
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: 'Please upload GST Certificate.'
                    })
                    return;
                }

                kycDetails = {
                    kyC_ID: this.currentUser.kycDetail.kyC_ID,
                    user_ID: this.currentUser.user.user_ID,
                    aadhar_Number: "",
                    aadhar_FontPhoto: "",
                    aadhar_BackPhoto: "",
                    pancard_Number: "",
                    pancard_Photo: "",
                    passport_Photo: "",
                    gsT_Number: this.gstnNo,
                    gsT_Photo: this.base64_file_data.gst_cert,
                    center_IndoorPhoto: "",
                    center_OutDoorPhoto: "",
                    user_Education: "",
                    education_Photo: ""
                };
                break;
            }
            case 'center': {
                console.log(this.base64_file_data);
                kycDetails = {
                    kyC_ID: this.currentUser.kycDetail.kyC_ID,
                    user_ID: this.currentUser.user.user_ID,
                    aadhar_Number: "",
                    aadhar_FontPhoto: "",
                    aadhar_BackPhoto: "",
                    pancard_Number: "",
                    pancard_Photo: "",
                    passport_Photo: "",
                    gsT_Number: "",
                    gsT_Photo: "",
                    center_IndoorPhoto: this.base64_file_data.center_indoor,
                    center_OutDoorPhoto: this.base64_file_data.center_outdoor,
                    user_Education: "",
                    education_Photo: ""
                };
                break;
            }
            case 'education': {
                if (!this.base64_file_data.education_certificate) {
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: 'Please upload education certificate.'
                    })
                    return;
                }

                kycDetails = {
                    kyC_ID: this.currentUser.kycDetail.kyC_ID,
                    user_ID: this.currentUser.user.user_ID,
                    aadhar_Number: "",
                    aadhar_FontPhoto: "",
                    aadhar_BackPhoto: "",
                    pancard_Number: "",
                    pancard_Photo: "",
                    passport_Photo: "",
                    gsT_Number: "",
                    gsT_Photo: "",
                    center_IndoorPhoto: "",
                    center_OutDoorPhoto: "",
                    user_Education: `education`,
                    education_Photo: this.base64_file_data.education_certificate
                };
                break;
            }

            default: {
                return;
            }
        }

        console.log(kycDetails)
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
                                this.checkKycDetailsWithVerifiedAdharAndPanResponse();
                                // Clear fields
                                if (type === 'adhar') {
                                    this.remove_file('adhar_front');
                                    this.remove_file('adhar_back');
                                } else if (type === 'pan') {
                                    this.remove_file('pan')
                                } else if (type === 'userphoto') {
                                    this.remove_file('pass_photo')
                                } else if (type === 'gstn') {
                                    this.remove_file('gst_cert')
                                } else if (type === 'center') {
                                    this.remove_file('center_indoor');
                                    this.remove_file('center_outdoor');
                                } else if (type === 'education') {
                                    this.remove_file('education_certificate')
                                }
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


    enrollForPMFBY() {
        const pmfby = {
            "posp_mobile": this.currentUser.user.mobile_Number,
            "email_id": this.currentUser.user.user_EmailID,
            "pan_no": this.panNo.value,
            "pan_status": "active",
            "name_as_pan": this.pan_verified_response.full_name,
            "dob_as_pan": this.pan_verified_response.dob,
            "fathername_as_pan": this.adhar_verified_response.care_of,
            "pan_issue_date": this.getPanIssueDateFromDob(this.pan_verified_response.dob),
            "masked_aadhaar_number": this.pan_verified_response.masked_aadhaar,
            "name_as_aadhaar": this.adhar_verified_response.full_name,
            "dob_as_aadhaar": this.adhar_verified_response.dob,
            "gender_as_aadhaar": this.adhar_verified_response.gender,
            "fathername_as_aadhaar": this.adhar_verified_response.care_of,
            "full_address": this.getFullAddressFromAdharResponse(this.adhar_verified_response.address),
            "pincode": this.adhar_verified_response.zip,
            "education": this.education,
            "bank_account_number": this.bankDetails.user_Account_Number,
            "bank_ifsc": this.bankDetails.user_IFSCCode,
            "account_holder_name": this.bankDetails.userAccount_HolderName,
            "bank_name": this.bankDetails.bank_Name
        }
        console.log(pmfby);
        this._loaderService.showLoader();
        this._authService.pmfbyRegistration(pmfby)
            .pipe(finalize(() => this._loaderService.hideLoader()), takeUntil(this.$destroy))
            .subscribe({
                next: (resp: any) => {
                    console.log('PMFBY Response =========')
                    console.log(resp)
                    if (resp.status === 'Success' && resp.code === 200) {
                        if (resp.data?.code === 101 && resp.data.data?.index_id) {
                            // It's pending status
                            // Call the document upload method
                            this.PMFBYDocUpload(+resp.data.data?.index_id)
                        } else if (resp.data?.code === 104) {
                            // Its error status
                            this._popupService.openAlert({
                                header:'Alert',
                                message: resp.data?.message
                            })
                        } else {
                            // Dont know the status so Call status API to get index_id
                            this._loaderService.showLoader()
                            this._authService.getPmfbyStatus(this.currentUser.user.mobile_Number)
                                .pipe(takeUntil(this.$destroy), finalize(() => this._loaderService.hideLoader()))
                                .subscribe({
                                    next: (stausResp: any) => {
                                        console.log(stausResp)
                                        if (stausResp.status === 'Success' && stausResp.code === 200) {
                                            if (stausResp.data.data?.index_id) {
                                                this.PMFBYDocUpload(+stausResp.data.data?.index_id)
                                            }
                                        } else {
                                            this._popupService.openAlert({
                                                header:'Alert',
                                                message: 'Something went wrong.'
                                            })
                                        }
                                    }
                                })
                        }

                    } else {
                        this._popupService.openAlert({
                            header: 'Alert',
                            message: "Server Error! Registration Unuccessful."
                        })
                    }
                }, error: (err) => {
                    console.log(err)
                    this._popupService.openAlert({
                        header: 'Fail',
                        message: "Error Occured. Registration Unuccessful."
                    })
                }
            })
    }

    PMFBYDocUpload(indexId: number) {
        const BASEURL = `https://api.esebakendra.com/api/User/Download?fileName=`
        const payload = {
            "index_id": indexId,
            "pan_image": BASEURL + this.kycDetails.pancard_Photo,
            "education_image": BASEURL + this.kycDetails.education_Photo,
            "profile_image": BASEURL + this.kycDetails.passport_Photo
        }
        console.log(payload);
        this._loaderService.showLoader();
        this._authService.pmfbyDocUpload(payload)
            .pipe(finalize(() => this._loaderService.hideLoader()), takeUntil(this.$destroy))
            .subscribe({
                next: (resp: any) => {
                    console.log(resp)
                    if (resp.status === 'Success' && resp.code === 200) {
                        if (resp.data?.code === 101) {
                            this._popupService.openAlert({
                                header: 'success',
                                message: resp.data?.message
                            })
                            // inform the parent component to fetch status
                            this.documentUploadedToPmbky.emit();

                        } else {
                            this._popupService.openAlert({
                                header: 'fail',
                                message: resp.data?.message
                            })
                        }
                    }
                },
                error: (err) => {
                    console.log(err)
                    this._popupService.openAlert({
                        header: 'fail',
                        message: 'Failed to save data'
                    })
                }
            })
    }



    generateOtpForAdharValidate() {
        this._loaderService.showLoader()
        this._authService.generateOtpForAdharValidate({
            "adharaNumber": this.adharNo.value,
            "userId": this.currentUser.user.user_ID
        })
            .pipe(finalize(() => this._loaderService.hideLoader()), takeUntil(this.$destroy))
            .subscribe({
                next: (resp: any) => {
                    if (resp.status === 'Success' && resp.code === 200 && resp.data?.success && resp.data?.message_code === 'success' && resp.data?.data?.otp_sent) {
                        this._popupService.openAlert({
                            header: 'Success',
                            message: resp.data.message
                        });
                        this.adhar_client_id = resp.data?.data?.client_id;
                    } else {
                        this._popupService.openAlert({
                            header: 'Alert',
                            message: resp.data.message
                        })
                    }
                },
                error: (err) => {
                    this._popupService.openAlert({
                        header: 'Fail',
                        message: 'Error while sending OTP to registered mobile number.'
                    })
                }
            })
    }


    adharOtpSubmit() {
        const payload = {
            "client_id": this.adhar_client_id,
            "otp": this.adhar_otp
        }
        this._loaderService.showLoader();
        this._authService.verifyOtpForAdhar(this.currentUser.user.user_ID, payload)
            .pipe(finalize(() => this._loaderService.hideLoader()), takeUntil(this.$destroy))
            .subscribe({
                next: (resp: any) => {
                    if (resp.status === 'Success' && resp.code === 200 && resp.data?.success && resp.data?.message_code === 'success' && resp.data?.data) {
                        this.adhar_verified_response = resp.data?.data;
                        this.isAdharAlreadyVerified = !!resp.data?.data?.aadhaar_number;

                        // If adhar card number is already there then check equality
                        if (this.kycDetails.aadhaar_Number) {
                            this.isKycAdharAndVerifiedAdharMismatch = (this.adhar_verified_response?.aadhaar_number !== this.kycDetails?.aadhaar_Number)
                        }
                        console.log('Adhar mismatch ' + this.isKycAdharAndVerifiedAdharMismatch)

                        if (this.isAdharAlreadyVerified) {
                            this.adharNo.patchValue(this.adhar_verified_response?.aadhaar_number);
                            this.showVerifyAdharButton = false;
                            this.adhar_client_id = '';
                        } else {
                            this.showVerifyAdharButton = true;
                        }
                    } else {
                        this._popupService.openAlert({
                            header: 'Alert',
                            message: resp.data.message
                        })
                    }
                },
                error: (err) => {
                    this._popupService.openAlert({
                        header: 'Fail',
                        message: 'Error while verifying OTP. Please try again later.'
                    })
                }
            })
    }



    verifyPan() {
        this._loaderService.showLoader();
        this._authService.verifyPanDetails(this.currentUser.user.user_ID, {
            "panNumber": this.panNo.value,
            "userId": this.currentUser.user.user_ID
        })
            .pipe(finalize(() => this._loaderService.hideLoader()), takeUntil(this.$destroy))
            .subscribe({
                next: (resp: any) => {
                    if (resp.status === 'Success' && resp.code === 200 && resp.data?.success && resp.data?.message_code === 'success' && resp.data?.data) {
                        this.pan_verified_response = resp.data?.data;
                        this.isPanAlreadyVerified = !!this.pan_verified_response?.pan_number;

                        // If Pan card is already available then equality check 
                        if (this.kycDetails.pancard_Number) {
                            // this.isPanAlreadyVerified = this.isPanAlreadyVerified && (this.pan_verified_response?.pan_number?.toLowerCase() === this.kycDetails.pancard_Number?.toLowerCase());
                            this.isKycPanAndVerifiedPanMismatch = (this.pan_verified_response?.pan_number?.toLowerCase() !== this.kycDetails?.pancard_Number?.toLowerCase());
                        }
                        console.log('Pan mismatch ' + this.isKycPanAndVerifiedPanMismatch)

                        if (this.isPanAlreadyVerified) {
                            this.panNo.patchValue(this.pan_verified_response?.pan_number)
                            this.showVerifyPanButton = false;
                        } else {
                            this.showVerifyPanButton = true;
                        }
                    } else {
                        this._popupService.openAlert({
                            header: 'Alert',
                            message: resp.data.message
                        })
                    }
                },
                error: (err) => {
                    this._popupService.openAlert({
                        header: 'Fail',
                        message: 'Error while verifying PAN. Please try again later.'
                    })
                }
            })
    }


    getPanIssueDateFromDob(date: string) {
        return new Date(new Date(date).getTime() + (20 * 366 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    }


    onChange(e: any) {
        console.log(e);
        console.log(this.education)
    }


    checkKycDetailsWithVerifiedAdharAndPanResponse() {

        // If Adhar number is already there then only equate 
        if (this.kycDetails.aadhar_Number) {
            this.isKycAdharAndVerifiedAdharMismatch = (this.adhar_verified_response?.aadhaar_number !== this.kycDetails?.aadhar_Number)
        }
        console.log('Adhar mismatch ' + this.isKycAdharAndVerifiedAdharMismatch)

        // If Pan card is already available then equality check 
        if (this.kycDetails.pancard_Number) {
            this.isKycPanAndVerifiedPanMismatch = (this.pan_verified_response?.pan_number?.toLowerCase() !== this.kycDetails?.pancard_Number?.toLowerCase());
        }
        console.log('Pan mismatch ' + this.isKycPanAndVerifiedPanMismatch)
    }


    getFullAddressFromAdharResponse(add: any) {
        return Object.entries(add).reduce((acc, curr) => { return acc + curr[1] + ", " }, "")
    }

    



}
