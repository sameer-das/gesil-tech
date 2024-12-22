import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AadharService } from '../aadhar.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { PopupService } from 'src/app/popups/popup.service';

@Component({
    selector: 'app-aadhar-enrollment-form-stepper',
    templateUrl: './aadhar-enrollment-form-stepper.component.html',
    styleUrls: ['./aadhar-enrollment-form-stepper.component.scss']
})
export class AadharEnrollmentFormStepperComponent implements OnInit, OnChanges {

    @Input('aadharEnrolmentDetails') details: any;

    @ViewChild('certificate') certificate!: ElementRef;
    @ViewChild('aadhar_front') aadhar_front!: ElementRef;
    @ViewChild('aadhar_back') aadhar_back!: ElementRef;
    @ViewChild('pan') pan!: ElementRef;
    @ViewChild('education_certificate') education_certificate!: ElementRef;
    @ViewChild('photo') photo!: ElementRef;

    currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
    destroy$: Subject<boolean> = new Subject();

    file_names: any = {
        certificate: '',
        aadhar_front: '',
        aadhar_back: '',
        pan: '',
        education_certificate: '',
        photo: ''
    };

    base64_file_data: any = {
        certificate: '',
        aadhar_front: '',
        aadhar_back: '',
        pan: '',
        education_certificate: '',
        photo: ''
    };


    snackBarConfig: MatSnackBarConfig = {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'snackbar_css',
    };

    today: Date = new Date();

    nseitFormGroup = new FormGroup({
        nseit_certificate_number: new FormControl('', [Validators.required]),
        nseit_certificate_file_name: new FormControl('', [Validators.required]),
        nseit_certificate_date: new FormControl('', [Validators.required]),
        nseit_certificate_type: new FormControl('', [Validators.required]),
    });


    aadharFormGroup = new FormGroup({
        aadhar_no: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[0-9]{12}$')]),
        name: new FormControl('', [Validators.required]),
        aadhar_front_name: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        father_name: new FormControl('', [Validators.required]),
        dob: new FormControl('', [Validators.required]),
        aadhar_phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}')]),
        aadhar_email: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]),
        aadhar_enrollment_no: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
        aadhar_enrollment_date: new FormControl('', [Validators.required]),
        aadhar_enrollment_time: new FormControl('', [Validators.required]),
        address_at: new FormControl('', [Validators.required]),
        address_post: new FormControl('', [Validators.required]),
        address_block: new FormControl('', [Validators.required]),
        address_dist: new FormControl('', [Validators.required]),
        address_pin: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]),
        address_state: new FormControl('', [Validators.required]),
    })


    panFormGroup = new FormGroup({
        pan: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
        pan_image_name: new FormControl('', [Validators.required]),
    })

    aadharCenterAddressFromGroup = new FormGroup({
        aadhar_center_address_state: new FormControl('', [Validators.required]),
        aadhar_center_address_dist: new FormControl('', [Validators.required]),
        aadhar_center_address_block: new FormControl('', [Validators.required]),
        aadhar_center_address_nacgp: new FormControl('', [Validators.required]),
        aadhar_center_address_wardno: new FormControl('', [Validators.required]),
        aadhar_center_address_pin: new FormControl('', [Validators.required]),
    })

    educationFormGroup = new FormGroup({
        education: new FormControl('', [Validators.required]),
        education_certificate_name: new FormControl('', [Validators.required]),
    })

    photoFormGroup = new FormGroup({
        photo: new FormControl('', [Validators.required]),
    })



    constructor(private _snackBar: MatSnackBar,
        private _aadharService: AadharService,
        private _loaderService: LoaderService,
        private _popupService: PopupService
    ) { }


    ngOnChanges(changes: SimpleChanges): void {
        this.patchNseitForm();
        this.patchAadharForm();
        this.patchPanForm();
        this.patchAadharCetnerAddressForm();
        this.patchEducationForm();
        this.patchPhotoForm();
    }



    ngOnInit(): void { }

    patchNseitForm() {
        this.nseitFormGroup.patchValue({
            nseit_certificate_number: this.details.nseit_certificate_number,
            nseit_certificate_file_name: this.details.nseit_certificate_file_name,
            nseit_certificate_date: this.details.nseit_certificate_date,
            nseit_certificate_type: this.details.nseit_certificate_type,
        })
    }

    patchAadharForm() {
        this.aadharFormGroup.patchValue({
            aadhar_no: this.details.aadhar_no,
            name: this.details.name,
            aadhar_front_name: this.details.aadhar_front_name,
            gender: this.details.gender,
            father_name: this.details.father_name,
            dob: this.details.dob,
            aadhar_phone: this.details.aadhar_phone,
            aadhar_email: this.details.aadhar_email,
            aadhar_enrollment_no: this.details.aadhar_enrollment_no,
            aadhar_enrollment_date: this.details.aadhar_enrollment_date,
            aadhar_enrollment_time: this.details.aadhar_enrollment_time,
            address_at: this.details.address_at,
            address_post: this.details.address_post,
            address_block: this.details.address_block,
            address_dist: this.details.address_dist,
            address_pin: this.details.address_pin,
            address_state: this.details.address_state
        })
    }

    patchPanForm() {
        this.panFormGroup.patchValue({
            pan: this.details.pan,
            pan_image_name: this.details.pan_image_name,
        })
    }

    patchAadharCetnerAddressForm() {
        this.aadharCenterAddressFromGroup.patchValue({
            aadhar_center_address_state: this.details.aadhar_center_address_state,
            aadhar_center_address_dist: this.details.aadhar_center_address_dist,
            aadhar_center_address_block: this.details.aadhar_center_address_block,
            aadhar_center_address_nacgp: this.details.aadhar_center_address_nacgp,
            aadhar_center_address_wardno: this.details.aadhar_center_address_wardno,
            aadhar_center_address_pin: this.details.aadhar_center_address_pin,
        })
    }

    patchEducationForm() {
        this.educationFormGroup.patchValue({
            education: this.details.education,
            education_certificate_name: this.details.education_certificate_name,
        })
    }

    patchPhotoForm() {
        this.photoFormGroup.patchValue({
            photo: this.details.photo
        })
    }



    handleUpload(e: Event, name: string) {
        // console.log(name);
        const target: any = e.target;
        const file = target?.files[0];
        URL.createObjectURL(file)
        if (file && !this.isInvalidFile(file, name)) {
            this.file_names[name] = file.name;

            if (name === 'certificate') {
                this.nseitFormGroup.patchValue({
                    nseit_certificate_file_name: file.name
                })
            }

            else if (name === 'aadhar_front') {
                this.aadharFormGroup.patchValue({
                    aadhar_front_name: file.name
                })
            }
            else if (name === 'pan') {
                this.panFormGroup.patchValue({
                    pan_image_name: file.name
                })
            }
            else if (name === 'education_certificate') {
                this.educationFormGroup.patchValue({
                    education_certificate_name: file.name
                })
            } else if (name === 'photo') {
                this.photoFormGroup.patchValue({
                    photo: file.name
                })
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.base64_file_data[name] = reader.result;
            };
        }
    }



    isInvalidFile(file: File, name: string): boolean {
        // console.log(file)
        if (name === 'photo') {
            if (!['image/jpeg'].includes(file.type)) {
                this.remove_file(name);
                this._snackBar.open(
                    'Please upload a JPEG format file!',
                    'Alert',
                    this.snackBarConfig
                );

                return true;
            }
        } else {
            if (!['application/pdf'].includes(file.type)) {
                this.remove_file(name);
                this._snackBar.open(
                    'Please upload a PDF format file!',
                    'Alert',
                    this.snackBarConfig
                );
                return true;
            }
        }
        return false;
    }



    remove_file(name: string) {
        this.base64_file_data[name] = '';
        if (name === 'aadhar_front') {
            this.aadhar_front.nativeElement.value = '';
            this.file_names.aadhar_front = '';
            this.aadharFormGroup.patchValue({
                aadhar_front_name: ''
            })
        } else if (name === 'aadhar_back') {
            this.aadhar_back.nativeElement.value = '';
            this.file_names.aadhar_back = '';
        } else if (name === 'pan') {
            this.pan.nativeElement.value = '';
            this.file_names.pan = '';
            this.panFormGroup.patchValue({
                pan_image_name: ''
            })
        } else if (name === 'certificate') {
            this.certificate.nativeElement.value = '';
            this.file_names.certificate = '';
            this.nseitFormGroup.patchValue({
                nseit_certificate_file_name: ''
            })
        } else if (name === 'education_certificate') {
            this.education_certificate.nativeElement.value = '';
            this.file_names.education_certificate = '';
            this.educationFormGroup.patchValue({
                education_certificate_name: ''
            })
        } else if (name === 'photo') {
            this.photo.nativeElement.value = '';
            this.file_names.photo = '';
            this.photoFormGroup.patchValue({
                photo: ''
            })
        }
    }




    getDate(date: Date | string) {
        const d = new Date(date).getTime() + 19800000;
        return new Date(d).toISOString();
    }

    getAadharDetails() {
        this._loaderService.showLoader();
        this._aadharService.getAadharInfo(this.currentUser.user.user_ID)
            .pipe(
                finalize(() => this._loaderService.hideLoader()),
                takeUntil(this.destroy$)
            ).subscribe({
                next: (resp: any) => {
                    console.log(resp)
                    if (resp.code === 200 && resp.status === 'Success') {
                        if (resp.data.length > 0) {
                            this.details = resp.data[0];

                            this.patchNseitForm();
                            this.patchAadharForm();
                            this.patchPanForm();
                            this.patchAadharCetnerAddressForm();
                            this.patchEducationForm();
                            this.patchPhotoForm();
                        } else {

                        }
                    }
                },
                error: (err: any) => {
                    console.log(err);
                }
            })
    }

    onSaveNseitDetails() {
        const payload = {
            "gesil_userid": this.currentUser.user.user_ID,
            "nseit_certificate_number": this.nseitFormGroup.value.nseit_certificate_number,
            "nseit_certificate_file_name": this.nseitFormGroup.value.nseit_certificate_file_name,
            "nseit_certificate_file_base64": this.base64_file_data.certificate,
            "nseit_certificate_date": this.getDate(this.nseitFormGroup.value.nseit_certificate_date),
            "nseit_certificate_type": this.nseitFormGroup.value.nseit_certificate_type,
        }


        this._loaderService.showLoader()
        this._aadharService.saveNseitDetails(payload).pipe(
            finalize(() => this._loaderService.hideLoader()),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (resp: any) => {
                console.log(resp);
                if (resp.status === 'Success' && resp.code === 200 && resp.data === 'S') {
                    // this.getAadharDetails();
                    this._popupService.openAlert({
                        header: 'success',
                        message: 'NSEIT details updated successfully.'
                    })
                } else {
                    this._popupService.openAlert({
                        header: 'alert',
                        message: 'Failed to update NSEIT details.'
                    })
                }

            },
            error: (err: any) => {
                console.log(err);
                this._popupService.openAlert({
                    header: 'fail',
                    message: 'Error while updating NSEIT details.'
                })
            }
        })
    }

    onSaveAadharDetails() {
        const payload = {
            "gesil_userid": this.currentUser.user.user_ID,
            "aadhar_no": this.aadharFormGroup.value.aadhar_no,
            "name": this.aadharFormGroup.value.name,
            "aadhar_front_name": this.aadharFormGroup.value.aadhar_front_name,
            "aadhar_front_base64": this.base64_file_data.aadhar_front,
            "gender": this.aadharFormGroup.value.gender,
            "father_name": this.aadharFormGroup.value.father_name,
            "dob": this.getDate(this.aadharFormGroup.value.dob),
            "aadhar_phone": this.aadharFormGroup.value.aadhar_phone,
            "aadhar_email": this.aadharFormGroup.value.aadhar_email,
            "aadhar_enrollment_no": this.aadharFormGroup.value.aadhar_enrollment_no,
            "aadhar_enrollment_date": this.getDate(this.aadharFormGroup.value.aadhar_enrollment_date),

            "address_at": this.aadharFormGroup.value.address_at,
            "address_post": this.aadharFormGroup.value.address_post,
            "address_block": this.aadharFormGroup.value.address_block,
            "address_dist": this.aadharFormGroup.value.address_dist,
            "address_pin": this.aadharFormGroup.value.address_pin,
            "address_state": this.aadharFormGroup.value.address_state,
        }

        this._loaderService.showLoader()
        this._aadharService.saveAadharDetails(payload).pipe(
            finalize(() => this._loaderService.hideLoader()),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (resp: any) => {
                console.log(resp);
                if (resp.status === 'Success' && resp.code === 200 && resp.data === 'S') {
                    // this.getAadharDetails();
                    this._popupService.openAlert({
                        header: 'success',
                        message: 'Aadhar details updated successfully.'
                    })
                } else {
                    this._popupService.openAlert({
                        header: 'alert',
                        message: 'Failed to update aadhar details.'
                    })
                }

            },
            error: (err: any) => {
                console.log(err);
                this._popupService.openAlert({
                    header: 'fail',
                    message: 'Error while updating aadhar details.'
                })
            }
        })
    }


    onSavePanDetails() {
        const payload = {
            "gesil_userid": this.currentUser.user.user_ID,
            "pan": this.panFormGroup.value.pan,
            "pan_image_name": this.panFormGroup.value.pan_image_name,
            "pan_image_base64": this.base64_file_data.pan,
        }

        this._loaderService.showLoader()
        this._aadharService.savePanDetails(payload).pipe(
            finalize(() => this._loaderService.hideLoader()),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (resp: any) => {
                console.log(resp);
                if (resp.status === 'Success' && resp.code === 200 && resp.data === 'S') {
                    // this.getAadharDetails();
                    this._popupService.openAlert({
                        header: 'success',
                        message: 'Pan details updated successfully.'
                    })
                } else {
                    this._popupService.openAlert({
                        header: 'alert',
                        message: 'Failed to update pan details.'
                    })
                }

            },
            error: (err: any) => {
                console.log(err);
                this._popupService.openAlert({
                    header: 'fail',
                    message: 'Error while updating pan details.'
                })
            }
        })
    }


    onSaveAadharCenterDetails() {
        const payload = {
            "gesil_userid": this.currentUser.user.user_ID,
            "aadhar_center_address_state": this.aadharCenterAddressFromGroup.value.aadhar_center_address_state,
            "aadhar_center_address_dist": this.aadharCenterAddressFromGroup.value.aadhar_center_address_dist,
            "aadhar_center_address_block": this.aadharCenterAddressFromGroup.value.aadhar_center_address_block,
            "aadhar_center_address_nacgp": this.aadharCenterAddressFromGroup.value.aadhar_center_address_nacgp,
            "aadhar_center_address_wardno": this.aadharCenterAddressFromGroup.value.aadhar_center_address_wardno,
            "aadhar_center_address_pin": this.aadharCenterAddressFromGroup.value.aadhar_center_address_pin,

        }

        this._loaderService.showLoader()
        this._aadharService.saveAadharCenterAddressDetails(payload).pipe(
            finalize(() => this._loaderService.hideLoader()),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (resp: any) => {
                console.log(resp);
                if (resp.status === 'Success' && resp.code === 200 && resp.data === 'S') {
                    // this.getAadharDetails();
                    this._popupService.openAlert({
                        header: 'success',
                        message: 'Aadhar center details updated successfully.'
                    })
                } else {
                    this._popupService.openAlert({
                        header: 'alert',
                        message: 'Failed to update aadhar center details.'
                    })
                }

            },
            error: (err: any) => {
                console.log(err);
                this._popupService.openAlert({
                    header: 'fail',
                    message: 'Error while updating aadhar center details.'
                })
            }
        })
    }

    onSaveEducationDetails() {
        const payload = {
            "gesil_userid": this.currentUser.user.user_ID,
            "education": this.educationFormGroup.value.education,
            "education_certificate_name": this.educationFormGroup.value.education_certificate_name,
            "education_certificate_base64": this.base64_file_data.education_certificate,
        }

        this._loaderService.showLoader()
        this._aadharService.saveEducationDetails(payload).pipe(
            finalize(() => this._loaderService.hideLoader()),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (resp: any) => {
                console.log(resp);
                if (resp.status === 'Success' && resp.code === 200 && resp.data === 'S') {
                    // this.getAadharDetails();
                    this._popupService.openAlert({
                        header: 'success',
                        message: 'Education details updated successfully.'
                    })
                } else {
                    this._popupService.openAlert({
                        header: 'alert',
                        message: 'Failed to update education details.'
                    })
                }

            },
            error: (err: any) => {
                console.log(err);
                this._popupService.openAlert({
                    header: 'fail',
                    message: 'Error while updating education details.'
                })
            }
        })
    }


    onSavePhotoDetails() {
        const payload = {
            "gesil_userid": this.currentUser.user.user_ID,
            "photo": this.photoFormGroup.value.photo,
            "photo_base64": this.base64_file_data.photo,
        }

        this._loaderService.showLoader()
        this._aadharService.savePhotoDetails(payload).pipe(
            finalize(() => this._loaderService.hideLoader()),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (resp: any) => {
                console.log(resp);
                if (resp.status === 'Success' && resp.code === 200 && resp.data === 'S') {
                    // this.getAadharDetails();
                    this._popupService.openAlert({
                        header: 'success',
                        message: 'Photo updated successfully.'
                    })
                } else {
                    this._popupService.openAlert({
                        header: 'alert',
                        message: 'Failed to update photo.'
                    })
                }

            },
            error: (err: any) => {
                console.log(err);
                this._popupService.openAlert({
                    header: 'fail',
                    message: 'Error while updating photo.'
                })
            }
        })
    }


}
