import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';
import * as moment from 'moment'; 
import { PopupService } from 'src/app/popups/popup.service';

@Component({
    selector: 'app-aadhar-check',
    templateUrl: './aadhar-check.component.html',
    styleUrls: ['./aadhar-check.component.scss']
})
export class AadharCheckComponent implements OnInit {

    constructor(private _popupService:PopupService) { }

    destroy$: Subject<boolean> = new Subject();
    today: Date = new Date();
    showEnrollmentForm: boolean = false;

    checkAadharFormGroup = new FormGroup({
        haveUsedAadhar: new FormControl('', [Validators.required]),
        // userId: new FormControl('')
    })


    ngOnInit (): void {
        this.checkAadharFormGroup.get('haveUsedAadhar')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe({next: (val:string) => {
            if(val === 'yes') {
                this.checkAadharFormGroup.addControl('userId', new FormControl('', [Validators.required, Validators.minLength(8)]));
                this.checkAadharFormGroup.addControl('isUserIdActive', new FormControl('', Validators.required));
                this.checkAadharFormGroup.get('isUserIdActive')?.valueChanges
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (status:string) => {
                            if(status === 'de-active') {
                                this.checkAadharFormGroup.addControl('deactiveReason', new FormControl('suspended', Validators.required));
                                this.checkAadharFormGroup.addControl('dateOfDeactivation', new FormControl('suspended', [Validators.required]));
                                this.checkAadharFormGroup.addControl('duration', new FormControl('', [Validators.required, ]));
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
        }})
        
    }

// Validators.pattern('^[1-9]{1}$')
    onProceedClick () {
        console.log(this.checkAadharFormGroup.value)
       const x =  moment(this.checkAadharFormGroup.value.dateOfDeactivation).format('YYYY-MM-DD');
       console.log(x)


    //    Add Months to date
        const currentDate = moment(this.checkAadharFormGroup.value.dateOfDeactivation);
        let futureMonth = currentDate.add(+(this.checkAadharFormGroup.value.duration * 30), 'd');


        const expiryDate = futureMonth.format('DD-MM-YYYY')
        console.log(expiryDate);

        if(moment(new Date()).isAfter(futureMonth)) {
            this.showEnrollmentForm = true;
        } else {
            console.log('block')
            this._popupService.openAlert({
                header:'Alert',
                message:`Sorry! Your User ID is blocked/suspended till ${expiryDate}. You can't proceed further.`
            })
        }
    }

}
