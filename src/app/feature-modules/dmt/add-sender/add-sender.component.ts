import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-sender',
  templateUrl: './add-sender.component.html',
  styleUrls: ['./add-sender.component.scss']
})
export class AddSenderComponent implements OnInit {

  constructor() { }

  addSenderForm: FormGroup = new FormGroup({
    senderName: new FormControl('', Validators.required),
    senderMobile: new FormControl('', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]),
    transactionType: new FormControl(null, Validators.required),
  })


  get f(): { [key: string]: AbstractControl } {
    return this.addSenderForm.controls;
  }
  
  ngOnInit(): void {
  }

  onFormSubmit() {
    console.log(this.addSenderForm)
  }
}
