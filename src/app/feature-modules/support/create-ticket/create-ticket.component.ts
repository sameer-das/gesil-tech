import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'src/app/popups/popup.service';
import { SupportService } from '../support.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit {

  constructor(private _supportService: SupportService, private _popupService: PopupService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  ticketFormGroup: FormGroup = new FormGroup({
    subject: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
  })
  ngOnInit(): void {
  }



  onSubmit() {
    console.log(this.ticketFormGroup.value);
    this._supportService.postTicketInfo(
      {
        "name": this.currentUser.personalDetail.user_FName,
        "email": this.currentUser.user.user_EmailID,
        "subject": this.ticketFormGroup.value.subject,
        "description": this.ticketFormGroup.value.description
      }
    ).subscribe({
      next: (resp: any) => {
        console.log(resp)
        if (resp.status === 'Success' && resp.code === 200) {
          this._popupService.openAlert({
            header: 'Success',
            message: 'Your complain has been registered successfully! Our team will reach you for assistance.'
          });
          this.ticketFormGroup.reset();
        } else {
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while raising complaint. Please try after sometime.'
          })
        }
      }, error: (err: any) => {
        console.log('error while raising complain');
        console.log(err)
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while raising complaint. Please try after sometime.'
        })
      }
    })
  }

}
