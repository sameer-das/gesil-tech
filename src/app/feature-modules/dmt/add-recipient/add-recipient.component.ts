import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-recipient',
  templateUrl: './add-recipient.component.html',
  styleUrls: ['./add-recipient.component.scss']
})
export class AddRecipientComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
/**
 * confirmAccountNumber: new FormControl('', { validators: [Validators.required, Validators.pattern('^[0-9]*$')], updateOn: 'blur' }),
    ifsc: new FormControl('', { validators: [Validators.required, Validators.pattern('^[0-9a-zA-Z]+$')] }),
    amount: new FormControl('', { validators: [Validators.required, Validators.pattern('^[0-9]*(\.[0-9]{0,2})?$')] }),
 */
  addRecipientForm: FormGroup = new FormGroup({
    recipientFullName: new FormControl('', Validators.required),
    recipientMobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    transactionType: new FormControl('', Validators.required),
    bank: new FormControl('', Validators.required),
    accountNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    confirmAccountNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    ifsc: new FormControl('', [Validators.required, Validators.pattern('^[0-9a-zA-Z]+$')]),
  })

  get f(): { [key: string]: AbstractControl } {
    return this.addRecipientForm.controls
  }

  onSubmitForm(): void {
    console.log(this.addRecipientForm)
  }

}
