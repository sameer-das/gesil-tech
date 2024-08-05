import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, tap } from 'rxjs';

@Component({
    selector: 'app-aadhar-check',
    templateUrl: './aadhar-check.component.html',
    styleUrls: ['./aadhar-check.component.scss']
})
export class AadharCheckComponent implements OnInit {

    constructor() { }

    destroy$: Subject<boolean> = new Subject();
    today: Date = new Date();

    checkAadharFormGroup = new FormGroup({
        haveUsedAadhar: new FormControl('no'),
        // userId: new FormControl('')
    })


    ngOnInit (): void {
        this.checkAadharFormGroup.get('haveUsedAadhar')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe({next: (val:string) => {
            if(val === 'yes') {
                this.checkAadharFormGroup.addControl('userId', new FormControl('', [Validators.required, Validators.minLength(4)]));
                this.checkAadharFormGroup.addControl('isUserIdActive', new FormControl('active', Validators.required));
                this.checkAadharFormGroup.get('isUserIdActive')?.valueChanges
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: (status:string) => {
                            if(status === 'de-active') {
                                this.checkAadharFormGroup.addControl('deactiveReason', new FormControl('suspended', Validators.required));
                                this.checkAadharFormGroup.addControl('duration', new FormControl('', [Validators.required]));
                            }
                        } 
                    })
            } else {
                this.checkAadharFormGroup.removeControl('userId');
                this.checkAadharFormGroup.removeControl('isUserIdActive');
                this.checkAadharFormGroup.removeControl('deactiveReason');
                this.checkAadharFormGroup.removeControl('duration');
            }
        }})
        
    }


    onButtonClick () {
        console.log(this.checkAadharFormGroup.value)
    }

}
