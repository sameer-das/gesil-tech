import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AadharService } from '../aadhar.service';



enum EducationFileName  {
    TENTH_CERTIFICATE = 'tenth_certificate',
    TENTH_MARKSHEET ='tenth_marksheet',
    TWELFTH_CERTIFICATE ='twelfth_certificate',
    TWELFTH_MARKSHEET ='twelfth_marksheet',
    HIGHEST_EDUCATION_CERTIFICATE ='highest_education_certificate',
    HIGHEST_EDUCATION_MARKSHEET = 'highest_education_marksheet',
    LMS_CERTIFICATE = 'lms_certificate',
    POLICE_VERIFICATION_CERTIFICATE = 'police_verification_certificate'
}

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
    @ViewChild('photo') photo!: ElementRef;
    @ViewChild('education_certificate') education_certificate!: ElementRef;

    @ViewChild('tenth_certificate') tenth_certificate!: ElementRef;
    @ViewChild('tenth_marksheet') tenth_marksheet!: ElementRef;
    @ViewChild('twelfth_certificate') twelfth_certificate!: ElementRef;
    @ViewChild('twelfth_marksheet') twelfth_marksheet!: ElementRef;
    @ViewChild('highest_education_certificate') highest_education_certificate!: ElementRef;
    @ViewChild('highest_education_marksheet') highest_education_marksheet!: ElementRef;
    @ViewChild('lms_certificate') lms_certificate!: ElementRef;
    @ViewChild('police_verification_certificate') police_verification_certificate!: ElementRef;

    currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
    destroy$: Subject<boolean> = new Subject();

    states:any[] = [];
    districts:any[] = [];
    blocks:any[] = [];
    ac_districts:any[] = [];
    ac_blocks:any[] = [];

    file_names: any = {
        certificate: '',
        aadhar_front: '',
        aadhar_back: '',
        pan: '',
        education_certificate: '',
        photo: '',
        [EducationFileName.TENTH_CERTIFICATE]: '',
        [EducationFileName.TENTH_MARKSHEET]: '',
        [EducationFileName.TWELFTH_CERTIFICATE]: '',
        [EducationFileName.TWELFTH_MARKSHEET]: '',
        [EducationFileName.HIGHEST_EDUCATION_CERTIFICATE]: '',
        [EducationFileName.HIGHEST_EDUCATION_MARKSHEET]: '',
        [EducationFileName.LMS_CERTIFICATE]:'',
        [EducationFileName.POLICE_VERIFICATION_CERTIFICATE]: ''
    };

    base64_file_data: any = {
        certificate: '',
        aadhar_front: '',
        aadhar_back: '',
        pan: '',
        education_certificate: '',
        photo: '',
        [EducationFileName.TENTH_CERTIFICATE]: '',
        [EducationFileName.TENTH_MARKSHEET]: '',
        [EducationFileName.TWELFTH_CERTIFICATE]: '',
        [EducationFileName.TWELFTH_MARKSHEET]: '',
        [EducationFileName.HIGHEST_EDUCATION_CERTIFICATE]: '',
        [EducationFileName.HIGHEST_EDUCATION_MARKSHEET]: '',
        [EducationFileName.LMS_CERTIFICATE]:'',
        [EducationFileName.POLICE_VERIFICATION_CERTIFICATE]: ''
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
        // aadhar_enrollment_time: new FormControl('', [Validators.required]),
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
        aadhar_center_address_pin: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]),
    })

    educationFormGroup = new FormGroup({
        tenth_certificate_name: new FormControl('', [Validators.required]),
        tenth_marksheet_name: new FormControl('', [Validators.required]),
        twelfth_certificate_name: new FormControl('', [Validators.required]),
        twelfth_marksheet_name: new FormControl('', [Validators.required]),
        highest_education_certificate_name: new FormControl(''),
        highest_education_marksheet_name: new FormControl(''),
        lms_certificate_name: new FormControl(''),
        
    })

    photoFormGroup = new FormGroup({
        photo: new FormControl('', [Validators.required]),
    })



    constructor(private _snackBar: MatSnackBar,
        private _aadharService: AadharService,
        private _loaderService: LoaderService,
        private _popupService: PopupService,
        private _authService: AuthService
    ) { }


    ngOnChanges(changes: SimpleChanges): void {

        console.log(this.details);
        this.populateState();

        this.patchNseitForm();
        this.patchAadharForm();
        this.patchAadharCetnerAddressForm();
        this.patchPanForm();
        this.patchEducationForm();
        this.patchPhotoForm();

        if(this.details.aadhar_center_address_state !== 'Odisha') {
            this.educationFormGroup.addControl('police_verification_certificate_name', new FormControl('', [Validators.required]))
        } else {
            this.educationFormGroup.removeControl('police_verification_certificate_name');

        }
    }



    ngOnInit(): void {
        // ===========================================================================================
        this.aadharFormGroup.controls['address_state'].valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((state) => {
            this.districts = [];
            this.blocks = [];
            if(state)
                this.populateDistrict(state.state_ID)
        });

        // ===========================================================================================
        this.aadharFormGroup.controls['address_dist'].valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((dist) => {
            this.blocks = [];
            if(dist)
                this.populateBlock(this.aadharFormGroup.value['address_state'].state_ID,dist.district_ID)
        })

        // ===========================================================================================
        this.aadharCenterAddressFromGroup.controls['aadhar_center_address_state'].valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((state) => {
            this.ac_districts = [];
            this.ac_blocks = [];
            if(state)
                this.populateAcDistrict(state.state_ID)
        });

        // ===========================================================================================
        this.aadharCenterAddressFromGroup.controls['aadhar_center_address_dist'].valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((dist) => {
            this.ac_blocks = [];
            if(dist)
                this.populateAcBlock(this.aadharCenterAddressFromGroup.value['aadhar_center_address_state'].state_ID,dist.district_ID)
        })
    }

    populateState() {
        this._authService.getState(1).pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (resp: any) => {
                console.log(resp)
              if (resp.status === 'Success' && resp.code === 200) {
                
                this.states = resp.data;

                if(this.details.address_state !== '') {
                    const selectedState = this.states.filter(curr => curr.state_Name === this.details.address_state);
                    console.log(selectedState)
                    this.aadharFormGroup.patchValue({
                        address_state: selectedState[0]
                    });
                }

                if(this.details.aadhar_center_address_state != '') {
                    const selectedState = this.states.filter(curr => curr.state_Name === this.details.aadhar_center_address_state);
                    console.log(selectedState)
                    this.aadharCenterAddressFromGroup.patchValue({
                        aadhar_center_address_state: selectedState[0]
                    });
                }
              }
            },
            error: (err) => {
              console.error(err);
            },
          });
    }

    populateDistrict(stateId:number) {
        this._authService.getDistrict(stateId).pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (resp: any) => {
                console.log(resp)
              if (resp.status === 'Success' && resp.code === 200) {
                this.districts = resp.data;

                if(this.details.address_dist !== '') {
                    const selectedDistrict = this.districts.filter(curr => curr.district_Name === this.details.address_dist);
                    console.log(selectedDistrict)
                    this.aadharFormGroup.patchValue({
                        address_dist: selectedDistrict[0]
                    });
                }
              }
            },
            error: (err) => {
              console.error(err);
            },
          });
    }

    populateAcDistrict(stateId:number) {
        this._authService.getDistrict(stateId).pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (resp: any) => {
                console.log(resp)
              if (resp.status === 'Success' && resp.code === 200) {
                this.ac_districts = resp.data;

                if(this.details.aadhar_center_address_dist !== '') {
                    const selectedDistrict = this.ac_districts.filter(curr => curr.district_Name === this.details.aadhar_center_address_dist);
                    console.log(selectedDistrict)
                    this.aadharCenterAddressFromGroup.patchValue({
                        aadhar_center_address_dist: selectedDistrict[0]
                    });
                }
              }
            },
            error: (err) => {
              console.error(err);
            },
          });
    }

    populateBlock(stateId: number, districtId:number) {
        this._authService.getBlocks(stateId, districtId).pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (resp: any) => {
                console.log(resp)
              if (resp.status === 'Success' && resp.code === 200) {
                this.blocks = resp.data;

                if(this.details.address_block !== '') {
                    const selectedBlock = this.blocks.filter(curr => curr.block_Name === this.details.address_block);
                    console.log(selectedBlock)
                    this.aadharFormGroup.patchValue({
                        address_block: selectedBlock[0]
                    });
                }
              }
            },
            error: (err) => {
              console.error(err);
            },
          });
    }

    populateAcBlock(stateId: number, districtId:number) {
        this._authService.getBlocks(stateId, districtId).pipe(takeUntil(this.destroy$))
        .subscribe({
            next: (resp: any) => {
                console.log(resp)
              if (resp.status === 'Success' && resp.code === 200) {
                this.ac_blocks = resp.data;

                if(this.details.aadhar_center_address_block !== '') {
                    const selectedBlock = this.ac_blocks.filter(curr => curr.block_Name === this.details.aadhar_center_address_block);
                    console.log(selectedBlock)
                    this.aadharCenterAddressFromGroup.patchValue({
                        aadhar_center_address_block: selectedBlock[0]
                    });
                }
              }
            },
            error: (err) => {
              console.error(err);
            },
          });
    }

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
            // aadhar_enrollment_time: this.details.aadhar_enrollment_time,
            // address_state: this.details.address_state,
            // address_dist: this.details.address_dist,
            // address_block: this.details.address_block,
            address_at: this.details.address_at,
            address_post: this.details.address_post,
            address_pin: this.details.address_pin,
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
            // aadhar_center_address_state: this.details.aadhar_center_address_state,
            // aadhar_center_address_dist: this.details.aadhar_center_address_dist,
            // aadhar_center_address_block: this.details.aadhar_center_address_block,
            aadhar_center_address_nacgp: this.details.aadhar_center_address_nacgp,
            aadhar_center_address_wardno: this.details.aadhar_center_address_wardno,
            aadhar_center_address_pin: this.details.aadhar_center_address_pin,
        })
    }

    patchEducationForm() {
        this.educationFormGroup.patchValue({
            tenth_certificate_name: this.details.tenth_certificate_name,
            tenth_marksheet_name: this.details.tenth_marksheet_name,
            twelfth_certificate_name: this.details.twelfth_certificate_name,
            twelfth_marksheet_name: this.details.twelfth_marksheet_name,
            highest_education_certificate_name: this.details.highest_education_certificate_name,
            highest_education_marksheet_name: this.details.highest_education_marksheet_name,
            lms_certificate_name: this.details.lms_certificate_name,
            police_verification_certificate_name: this.details.police_verification_certificate_name,
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
            else if (name === 'photo') {
                this.photoFormGroup.patchValue({
                    photo: file.name
                })
            } 
            else if (name === EducationFileName.TENTH_MARKSHEET) {
                this.educationFormGroup.patchValue({
                    [`${EducationFileName.TENTH_MARKSHEET}_name`]: file.name
                })
            }
            else if (name === EducationFileName.TENTH_CERTIFICATE) {
                this.educationFormGroup.patchValue({
                    [`${EducationFileName.TENTH_CERTIFICATE}_name`]: file.name
                })
            }
            else if (name === EducationFileName.TWELFTH_MARKSHEET) {
                this.educationFormGroup.patchValue({
                    [`${EducationFileName.TWELFTH_MARKSHEET}_name`]: file.name
                })
            }
            else if (name === EducationFileName.TWELFTH_CERTIFICATE) {
                this.educationFormGroup.patchValue({
                    [`${EducationFileName.TWELFTH_CERTIFICATE}_name`]: file.name
                })
            }
            else if (name === EducationFileName.HIGHEST_EDUCATION_CERTIFICATE) {
                this.educationFormGroup.patchValue({
                    [`${EducationFileName.HIGHEST_EDUCATION_CERTIFICATE}_name`]: file.name
                })
            }
            else if (name === EducationFileName.HIGHEST_EDUCATION_MARKSHEET) {
                this.educationFormGroup.patchValue({
                    [`${EducationFileName.HIGHEST_EDUCATION_MARKSHEET}_name`]: file.name
                })
            }
            else if (name === EducationFileName.LMS_CERTIFICATE) {
                this.educationFormGroup.patchValue({
                    [`${EducationFileName.LMS_CERTIFICATE}_name`]: file.name
                })
            }
            else if (name === EducationFileName.POLICE_VERIFICATION_CERTIFICATE) {
                this.educationFormGroup.patchValue({
                    [`${EducationFileName.POLICE_VERIFICATION_CERTIFICATE}_name`]: file.name
                })
            }
        

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.base64_file_data[name] = reader.result;
                // call the API here
                this.uploadToServer(name)
            };
        }
    }

    uploadToServer(name: string) {
        const NAME_TO_DB_MAPPING: { [key: string]: string } = {
            'certificate': 'nseit',
            'aadhar_front': 'aadhar',
            'pan': 'pan',
            'photo': 'photo',
            'tenth_marksheet': 'education_10_marksheet',
            'tenth_certificate': 'education_10_cert',
            'twelfth_marksheet': 'education_12_marksheet',
            'twelfth_certificate': 'education_12_cert',
            'highest_education_marksheet': 'education_high_marksheet',
            'highest_education_certificate': 'education_high_cert',
            'lms_certificate': 'lms',
            'police_verification_certificate': 'police_verification',

        }

        const payload = {
            "gesil_userid": this.currentUser.user.user_ID,
            "document_type": NAME_TO_DB_MAPPING[name],
            document_name: '',
            document_base64: '',
        }

        if(['certificate','aadhar_front','aadhar_back','pan','photo'].indexOf(name) >= 0) {
            console.log('1');
            payload.document_name = this.file_names[name]
            payload.document_base64 = this.base64_file_data[name]
        } else if(Object.values(EducationFileName).includes(name as EducationFileName)) {
            console.log('2 -->' + name);
            payload.document_name = this.file_names[name];
            payload.document_base64 = this.base64_file_data[name];
        } else {
            this._popupService.openAlert({
                header: 'Alert',
                message: 'Invalid File Type!'
            })
            return;
        }

        this._loaderService.showLoader();
        this._aadharService.uploadAadharDocument(payload)
        .pipe( finalize(() => this._loaderService.hideLoader()), takeUntil(this.destroy$),)
        .subscribe({
            next: (resp:any) => {
                console.log(resp)
                if(resp.code === 200 && resp.status=== 'Success' && resp.data === 'S') {
                    this._popupService.openAlert({
                        header: 'Success',
                        message: 'Document uploaded successfully.'
                    })
                } else {
                    this._popupService.openAlert({
                        header: 'alert',
                        message: 'Document upload failed.'
                    })
                }
            },
            error: (err) => {
                console.log(err);
                this._popupService.openAlert({
                    header: 'fail',
                    message: 'Document upload error.'
                })
            }
        })



       
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
        } else if (name === 'photo') {
            this.photo.nativeElement.value = '';
            this.file_names.photo = '';
            this.photoFormGroup.patchValue({
                photo: ''
            })
        } else if (name === EducationFileName.TENTH_CERTIFICATE) {
            this.tenth_certificate.nativeElement.value = '';
            this.file_names[EducationFileName.TENTH_CERTIFICATE] = '';
            this.educationFormGroup.patchValue({
                [`${EducationFileName.TENTH_CERTIFICATE}_name`]: ''
            })
        } else if (name === EducationFileName.TENTH_MARKSHEET) {
            this.tenth_marksheet.nativeElement.value = '';
            this.file_names[EducationFileName.TENTH_MARKSHEET] = '';
            this.educationFormGroup.patchValue({
                [`${EducationFileName.TENTH_MARKSHEET}_name`]: ''
            })
        } else if (name === EducationFileName.TWELFTH_CERTIFICATE) {
            this.twelfth_certificate.nativeElement.value = '';
            this.file_names[EducationFileName.TWELFTH_CERTIFICATE] = '';
            this.educationFormGroup.patchValue({
                [`${EducationFileName.TWELFTH_CERTIFICATE}_name`]: ''
            })
        } else if (name === EducationFileName.TWELFTH_MARKSHEET) {
            this.twelfth_marksheet.nativeElement.value = '';
            this.file_names[EducationFileName.TWELFTH_MARKSHEET] = '';
            this.educationFormGroup.patchValue({
                [`${EducationFileName.TWELFTH_MARKSHEET}_name`]: ''
            })
        } else if (name === EducationFileName.HIGHEST_EDUCATION_CERTIFICATE) {
            this.highest_education_certificate.nativeElement.value = '';
            this.file_names[EducationFileName.HIGHEST_EDUCATION_CERTIFICATE] = '';
            this.educationFormGroup.patchValue({
                [`${EducationFileName.HIGHEST_EDUCATION_CERTIFICATE}_name`]: ''
            })
        } else if (name === EducationFileName.HIGHEST_EDUCATION_MARKSHEET) {
            this.highest_education_marksheet.nativeElement.value = '';
            this.file_names[EducationFileName.HIGHEST_EDUCATION_MARKSHEET] = '';
            this.educationFormGroup.patchValue({
                [`${EducationFileName.HIGHEST_EDUCATION_MARKSHEET}_name`]: ''
            })
        } else if (name === EducationFileName.LMS_CERTIFICATE) {
            this.lms_certificate.nativeElement.value = '';
            this.file_names[EducationFileName.LMS_CERTIFICATE] = '';
            this.educationFormGroup.patchValue({
                [`${EducationFileName.LMS_CERTIFICATE}_name`]: ''
            })
        } else if (name === EducationFileName.POLICE_VERIFICATION_CERTIFICATE) {
            this.police_verification_certificate.nativeElement.value = '';
            this.file_names[EducationFileName.POLICE_VERIFICATION_CERTIFICATE] = '';
            this.educationFormGroup.patchValue({
                [`${EducationFileName.POLICE_VERIFICATION_CERTIFICATE}_name`]: ''
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
            // "nseit_certificate_file_name": this.nseitFormGroup.value.nseit_certificate_file_name,
            // "nseit_certificate_file_base64": this.base64_file_data.certificate,
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
            // "aadhar_front_name": this.aadharFormGroup.value.aadhar_front_name,
            // "aadhar_front_base64": this.base64_file_data.aadhar_front,
            "gender": this.aadharFormGroup.value.gender,
            "father_name": this.aadharFormGroup.value.father_name,
            "dob": this.getDate(this.aadharFormGroup.value.dob),
            "aadhar_phone": this.aadharFormGroup.value.aadhar_phone,
            "aadhar_email": this.aadharFormGroup.value.aadhar_email,
            "aadhar_enrollment_no": this.aadharFormGroup.value.aadhar_enrollment_no,
            "aadhar_enrollment_date": this.getDate(this.aadharFormGroup.value.aadhar_enrollment_date),

            "address_state": this.aadharFormGroup.value.address_state.state_Name,
            "address_dist": this.aadharFormGroup.value.address_dist.district_Name,
            "address_block": this.aadharFormGroup.value.address_block.block_Name,
            "address_at": this.aadharFormGroup.value.address_at,
            "address_post": this.aadharFormGroup.value.address_post,
            "address_pin": this.aadharFormGroup.value.address_pin,
        }

        console.log(payload)

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
            // "pan_image_name": this.panFormGroup.value.pan_image_name,
            // "pan_image_base64": this.base64_file_data.pan,
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
            "aadhar_center_address_state": this.aadharCenterAddressFromGroup.value.aadhar_center_address_state.state_Name,
            "aadhar_center_address_dist": this.aadharCenterAddressFromGroup.value.aadhar_center_address_dist.district_Name,
            "aadhar_center_address_block": this.aadharCenterAddressFromGroup.value.aadhar_center_address_block.block_Name,
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
                    });

                    if(this.aadharCenterAddressFromGroup.value?.aadhar_center_address_state?.state_Name !== 'Odisha') {
                        this.educationFormGroup.addControl('police_verification_certificate_name', new FormControl('', [Validators.required]))
                    } else {
                        this.educationFormGroup.removeControl('police_verification_certificate_name');
                    }
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



}
