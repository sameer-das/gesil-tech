import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
    selector: 'app-aadhar-enrollment-form',
    templateUrl: './aadhar-enrollment-form.component.html',
    styleUrls: ['./aadhar-enrollment-form.component.scss']
})
export class AadharEnrollmentFormComponent implements OnInit {

    constructor(private _snackBar: MatSnackBar,) { }


    today: Date = new Date();

    @ViewChild('certificate') certificate!: ElementRef;
    @ViewChild('aadhar_front') aadhar_front!: ElementRef;
    @ViewChild('aadhar_back') aadhar_back!: ElementRef;
    @ViewChild('pan') pan!: ElementRef;
    @ViewChild('education_certificate') education_certificate!: ElementRef;
    @ViewChild('photo') photo!: ElementRef;

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


    enrollmentFormGroup: FormGroup = new FormGroup({
        nseit_certificate_number: new FormControl('', [Validators.required]),
        nseit_certificate_file_name: new FormControl('', [Validators.required]),
        nseit_certificate_date: new FormControl('', [Validators.required]),
        nseit_certificate_type: new FormControl('', [Validators.required]),

        aadhar_no: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[0-9]{12}$')]),
        name: new FormControl('', [Validators.required]),
        aadhar_front_name: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        father_name: new FormControl('', [Validators.required]),
        dob: new FormControl('', [Validators.required]),
        aadhar_phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}')]),
        aadhar_email: new FormControl('', [Validators.required]),
        aadhar_enrollment_no:  new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
        aadhar_enrollment_date: new FormControl('', [Validators.required]),
        aadhar_enrollment_time: new FormControl('', [Validators.required]),
        address_at: new FormControl('', [Validators.required]),
        address_post: new FormControl('', [Validators.required]),
        address_block: new FormControl('', [Validators.required]),
        address_dist: new FormControl('', [Validators.required]),
        address_pin: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{6}$')]),
        address_state: new FormControl('', [Validators.required]),

        pan: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
        pan_image_name: new FormControl('', [Validators.required]),

        aadhar_center_address_state: new FormControl('', [Validators.required]),
        aadhar_center_address_dist: new FormControl('', [Validators.required]),
        aadhar_center_address_block: new FormControl('', [Validators.required]),
        aadhar_center_address_nacgp: new FormControl('', [Validators.required]),
        aadhar_center_address_wardno: new FormControl('', [Validators.required]),
        aadhar_center_address_pin: new FormControl('', [Validators.required]),

        education: new FormControl('', [Validators.required]),
        education_certificate_name: new FormControl('', [Validators.required]),

        photo: new FormControl('', [Validators.required]), 

    });


    snackBarConfig: MatSnackBarConfig = {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'snackbar_css',
    };



    ngOnInit (): void {
    }



    handleUpload (e: Event, name: string) {
        console.log(name);
        const target: any = e.target;
        const file = target?.files[0];
        URL.createObjectURL(file)
        if (file && !this.isInvalidFile(file, name)) {
            this.file_names[name] = file.name;

            if(name === 'certificate') {
                this.enrollmentFormGroup.patchValue({
                    nseit_certificate_file_name: file.name
                })
            } else if (name === 'aadhar_front') {
                this.enrollmentFormGroup.patchValue({
                    aadhar_front_name: file.name
                })
            } else if (name === 'pan') {
                this.enrollmentFormGroup.patchValue({
                    pan_image_name: file.name
                })
            } else if (name === 'education_certificate') {
                this.enrollmentFormGroup.patchValue({
                    education_certificate_name: file.name
                })
            } else if (name === 'photo') {
                this.enrollmentFormGroup.patchValue({
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



    isInvalidFile (file: File, name: string): boolean {
        console.log(file)
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



    remove_file (name: string) {
        this.base64_file_data[name] = '';
        if (name === 'aadhar_front') {
            this.aadhar_front.nativeElement.value = '';
            this.file_names.aadhar_front = '';
            this.enrollmentFormGroup.patchValue({
                aadhar_front_name: ''
            })
        } else if (name === 'aadhar_back') {
            this.aadhar_back.nativeElement.value = '';
            this.file_names.aadhar_back = '';
        } else if (name === 'pan') {
            this.pan.nativeElement.value = '';
            this.file_names.pan = '';
            this.enrollmentFormGroup.patchValue({
                pan_image_name: ''
            })
        } else if (name === 'certificate') {
            this.certificate.nativeElement.value = '';
            this.file_names.certificate = '';
            this.enrollmentFormGroup.patchValue({
                nseit_certificate_file_name: ''
            })
        } else if (name === 'education_certificate') {
            this.education_certificate.nativeElement.value = '';
            this.file_names.education_certificate = '';
            this.enrollmentFormGroup.patchValue({
                education_certificate_name: ''
            })
        } else if (name === 'photo') {
            this.photo.nativeElement.value = '';
            this.file_names.photo = '';
            this.enrollmentFormGroup.patchValue({
                photo: ''
            })
        }
    }



    getDate(date: Date | string) {
        const d = new Date(date).getTime() + 19800000;
        return new Date(d).toISOString();
    }



    onFormSubmit () {
        console.log(this.enrollmentFormGroup.value);
        console.log(this.base64_file_data)
    }


}
