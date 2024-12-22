import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { finalize, Subject, takeUntil } from 'rxjs';
import { PopupService } from 'src/app/popups/popup.service';
import { LoaderService } from 'src/app/services/loader.service';
import { AadharService } from '../aadhar.service';

@Component({
    selector: 'app-aadhar-check',
    templateUrl: './aadhar-check.component.html',
    styleUrls: ['./aadhar-check.component.scss']
})
export class AadharCheckComponent implements OnInit, OnDestroy {

    constructor(private _popupService: PopupService, private _aadharService: AadharService, private _loaderService: LoaderService) { }

    currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
    destroy$: Subject<boolean> = new Subject();
    today: Date = new Date();
    showEnrollmentForm: boolean = false;
    showStatus: boolean = false;

    aadharEnrolmentDetails: any;

    checkAadharFormGroup = new FormGroup({
        haveUsedAadhar: new FormControl('', [Validators.required]),
        // userId: new FormControl('')
    })


    ngOnDestroy(): void {
        this.destroy$.next(true);
    }


    ngOnInit(): void {
        this.getAadharDetails();

        this.checkAadharFormGroup.get('haveUsedAadhar')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (val: string) => {
                    if (val === 'yes') {
                        this.checkAadharFormGroup.addControl('userId', new FormControl('', [Validators.required, Validators.minLength(8)]));
                        this.checkAadharFormGroup.addControl('isUserIdActive', new FormControl('', Validators.required));
                        this.checkAadharFormGroup.get('isUserIdActive')?.valueChanges
                            .pipe(takeUntil(this.destroy$))
                            .subscribe({
                                next: (status: string) => {
                                    if (status === 'de-active') {
                                        this.checkAadharFormGroup.addControl('deactiveReason', new FormControl('suspended', Validators.required));
                                        this.checkAadharFormGroup.addControl('dateOfDeactivation', new FormControl('suspended', [Validators.required]));
                                        this.checkAadharFormGroup.addControl('duration', new FormControl('', [Validators.required, Validators.pattern('^[1-9]{1}$')]));
                                    }
                                }
                            })
                    } else {
                        this.checkAadharFormGroup.removeControl('userId');
                        this.checkAadharFormGroup.removeControl('isUserIdActive');
                        this.checkAadharFormGroup.removeControl('deactiveReason');
                        this.checkAadharFormGroup.removeControl('dateOfDeactivation');
                        this.checkAadharFormGroup.removeControl('duration');
                    }
                }
            })

    }

    // Validators.pattern('^[1-9]{1}$')
    onProceedClick() {  
        if (this.checkAadharFormGroup.value.haveUsedAadhar === 'yes') {
            if (this.checkAadharFormGroup.value.isUserIdActive === 'active') {
                // go for insertion 
                const payload = {
                    "gesil_userid": this.currentUser.user.user_ID,
                    "used_aadhar_service_before": this.checkAadharFormGroup.value.haveUsedAadhar === 'yes',
                    "is_active": this.checkAadharFormGroup.value.isUserIdActive === 'active',
                    "aadhar_userid": this.checkAadharFormGroup.value.userId,
                    "reason_for_dactive": "",
                    "no_of_months": 0,
                    "date_of_deactivation": null
                }
                console.log(payload)
                this.insertToBackend(payload)
            } else if (this.checkAadharFormGroup.value.isUserIdActive === 'de-active') {

                function addMonths(date: Date, months: number) {
                    let result = new Date(date);
                    let day = result.getDate();
        
                    // Set the month and adjust the date for overflow
                    result.setMonth(result.getMonth() + months);
        
                    // If the day overflows (e.g., Feb 31), adjust to the last valid day of the month
                    if (result.getDate() < day) {
                        result.setDate(0); // Go back to the last day of the previous month
                    }
        
                    return result;
                }

                console.log('================= Date Comparison ================')
                console.log('Deactivation Date ==================> ' + this.checkAadharFormGroup.value.dateOfDeactivation);
                const expiryDate = addMonths(this.checkAadharFormGroup.value.dateOfDeactivation, +(this.checkAadharFormGroup.value.duration))
                console.log('Expiry Date ========================> ' + expiryDate);

                if (moment(new Date()).isAfter(expiryDate)) {
                    // go for insertion
                    const payload = {
                        "gesil_userid": this.currentUser.user.user_ID,
                        "used_aadhar_service_before": this.checkAadharFormGroup.value.haveUsedAadhar === 'yes',
                        "is_active": this.checkAadharFormGroup.value.isUserIdActive === 'active',
                        "aadhar_userid": this.checkAadharFormGroup.value.userId,
                        "reason_for_dactive": this.checkAadharFormGroup.value.deactiveReason,
                        "no_of_months": this.checkAadharFormGroup.value.formControlName,
                        "date_of_deactivation": this.checkAadharFormGroup.value.dateOfDeactivation
                    }
                    console.log(payload);
                    this.insertToBackend(payload)
                } else {
                    this._popupService.openAlert({
                        header: 'Alert',
                        message: `Sorry! Your User ID is blocked/suspended till ${expiryDate}. You can't proceed further.`
                    })
                }

            }
        } else if (this.checkAadharFormGroup.value.haveUsedAadhar === 'no') {
            const payload = {
                "gesil_userid": this.currentUser.user.user_ID,
                "used_aadhar_service_before": this.checkAadharFormGroup.value.haveUsedAadhar === 'yes',
                "is_active": false,
                "aadhar_userid": '',
                "reason_for_dactive": '',
                "no_of_months": 0,
                "date_of_deactivation": null
            }
            console.log(payload);
            this.insertToBackend(payload);

            // conyrollre - i server - severice - mastersrepository
            // clean - release - build 
            // c drive - publich folder - delete all
            // publis the code in vs
            // copy till app settting
            // IIS - explored - paste and replace - restart
        }

    }


    insertToBackend(payload: any) {
        this._loaderService.showLoader()
        this._aadharService.saveAadharEnrollment(payload).pipe(
            finalize(() => this._loaderService.hideLoader()),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (resp: any) => {
                if(resp.code === 200 && resp.status === 'Success' && resp.data[0].result === 'S') {
                    this.getAadharDetails();
                }
            },
            error: (err: any) => {
                console.log(err);
            }
        })
    }


    getAadharDetails () {
        this._loaderService.showLoader();
        this._aadharService.getAadharInfo(this.currentUser.user.user_ID)
        .pipe(
            finalize(() => this._loaderService.hideLoader()),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (resp: any) => {
                console.log(resp)
                if(resp.code === 200 && resp.status === 'Success') {
                    if(resp.data.length > 0) {
                        this.aadharEnrolmentDetails = resp.data[0];
                        this.showStatus = true;
                    } else {
                        this.showStatus = false;
                    }
                }
            },
            error: (err: any) => {
                console.log(err);
            }
        })
    }

}
