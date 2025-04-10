import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OtpService } from './otp-service/otp-service.service';

@Component({
  selector: 'app-otp-popup',
  templateUrl: './otp-popup.component.html',
  styleUrls: ['./otp-popup.component.scss']
})
export class OtpPopupComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private _dialogRef: MatDialogRef<OtpPopupComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: OtpPopupData,
    private _otpService: OtpService) { }
  inputArray: ElementRef[] = [];
  inputCount = 0;
  finalInput = "";
  isButtonDisabled: boolean = true;
  resendTime: number = this.data?.activateResendButtonAfter || 0;
  resendOtpCount: number = 0;

  otpLength!: number;
  arr: number[] = [];
  inputType: string = 'number';
  containerWidth!: string;
  ngAfterViewInit(): void {
    this.inputArray = this.inputs.toArray();
    this.addEventForInputs();
    this.startInput();
  }
  @ViewChildren('input') inputs!: QueryList<ElementRef>;

  interval: any;
  ngOnDestroy(): void {
    // console.log('on destory')

    window.removeEventListener('keyup', () => { });
    this.inputArray.forEach((element, ind) => {
      element.nativeElement.removeEventListener('click', () => { })
    })

    clearInterval(this.interval)
  }

  ngOnInit(): void {


    this.otpLength = this.data.otpLength || 6;
    this.arr = Array.from({length: this.otpLength}, (_, i) => i + 1);
    this.inputType = this.data.inputType || 'number';
    this.containerWidth = this.otpLength*80+'px';

    window.addEventListener("keyup", (e) => {
      if (this.inputCount > (this.otpLength - 1)) {
        this.isButtonDisabled = false;
        if (e.key == "Backspace") {
          this.finalInput = this.finalInput.substring(0, this.finalInput.length - 1);
          this.updateInputConfig(this.inputArray[this.inputArray.length - 1], false);
          this.inputArray[this.inputArray.length - 1].nativeElement.value = "";
          this.inputCount -= 1;
          this.isButtonDisabled = true;
        }
      }
    });

    if(this.data.showResendButton) {
      this.countDownForOtpResend();
    }

  }

  startInput() {
    this.inputCount = 0;
    this.finalInput = "";
    this.inputArray.forEach((element) => {
      element.nativeElement.value = "";
    });
    this.updateInputConfig(this.inputArray[0], false);
  };

  updateInputConfig(element: ElementRef, disabledStatus: boolean) {
    element.nativeElement.disabled = disabledStatus;
    if (!disabledStatus) {
      element.nativeElement.focus();
    } else {
      element.nativeElement.blur();
    }
  };

  onClose() {
    this._dialogRef.close({ otpAvailable: false, value: null })
  }

  onSubmit() {
    console.log('OTP entered', this.finalInput)
    this._dialogRef.close({ otpAvailable: true, value: this.finalInput })
  }

  onOtpResend() {
    this._otpService.sendOtp();
    this.resendOtpCount += 1;

    this.resendTime = this.data?.activateResendButtonAfter || 0;
    if(this.data.showResendButton && this.resendOtpCount < 3) {
      this.countDownForOtpResend();
    }
  }

  countDownForOtpResend() {
    if(this.resendTime > 0) {
      this.interval = setInterval(() => {
        this.resendTime -= 1;
        if (this.resendTime === 0)
          clearInterval(this.interval)
      }, 1000)
    }
  }

  addEventForInputs() {
    this.inputArray.forEach((element) => {
      element.nativeElement.addEventListener("keyup", (e: any) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
        let { value } = e.target;

        if (value.length == 1) {
          if (this.inputCount < (this.otpLength - 1))
            this.updateInputConfig(this.inputArray[this.inputCount], true);
          if (this.inputCount <= (this.otpLength - 1) && e.key != "Backspace") {
            this.finalInput += value;
            if (this.inputCount < (this.otpLength - 1)) {
              this.updateInputConfig(this.inputArray[this.inputCount + 1], false);
            }
          }
          this.inputCount += 1;
          console.log(this.inputCount, this.finalInput)
        } else if (value.length == 0 && e.key == "Backspace") {
          this.finalInput = this.finalInput.substring(0, this.finalInput.length - 1);
          if (this.inputCount == 0) {
            // this.updateInputConfig(this.inputArray[this.inputCount - 1], false);
            // return false;
          } else {

            this.updateInputConfig(this.inputArray[this.inputCount - 1], true);
            this.inputArray[this.inputCount - 1].nativeElement.value = ""
            // e.target.previousElementSibling.value = "";
            this.updateInputConfig(this.inputArray[this.inputCount - 1], false);
            this.inputCount -= 1;
          }
          console.log(this.inputCount, this.finalInput)
        } else if (value.length > 1) {
          e.target.value = value.split("")[0];
        }
      });
    });
  }

}

export interface OtpPopupData {
  title: string;
  otpLength?: number;
  inputType?: string;
  showResendButton?: boolean;
  activateResendButtonAfter?: number;
}
