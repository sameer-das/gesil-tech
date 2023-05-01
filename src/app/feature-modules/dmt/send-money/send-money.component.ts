import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.scss']
})
export class SendMoneyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  sendMoneyForm: FormGroup = new FormGroup({
    recipient: new FormControl('', Validators.required),
    transactionType: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*(\.[0-9]{0,2})?$')])
  })

  get f(): { [key: string]: AbstractControl } {
    return this.sendMoneyForm.controls;
  }

  onSubmit() {
    console.log(this.sendMoneyForm)
  }
}
