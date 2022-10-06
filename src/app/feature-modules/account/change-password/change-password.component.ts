import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private _fb:FormBuilder) { }

  ngOnInit(): void {
  }

  changePasswordForm: FormGroup = this._fb.group({
    current: new FormControl('', Validators.required),
    new: new FormControl('', Validators.required),
    cnew:new FormControl('', Validators.required)
  });

  onSubmit():void {
    console.log(this.changePasswordForm.value);
  }

  formClear():void {
    this.changePasswordForm.reset();
  }

}
