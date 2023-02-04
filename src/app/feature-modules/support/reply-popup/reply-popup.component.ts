import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopupService } from 'src/app/popups/popup.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SupportService } from '../support.service';

@Component({
  selector: 'app-reply-popup',
  templateUrl: './reply-popup.component.html',
  styleUrls: ['./reply-popup.component.scss']
})
export class ReplyPopupComponent implements OnInit {
  id!: number;
  reply: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private _supportService: SupportService,
    private dialogRef: MatDialogRef<ReplyPopupComponent>, private _popupService: PopupService,
    private _loaderService:LoaderService) {
    this.id = data;
  }

  ngOnInit(): void {
    console.log(this.id)
  }


  postReply() {
    this._loaderService.showLoader();
    this._supportService.postTicketReply({
      "id": this.id,
      "desc": this.reply
    }).subscribe({
      next: (resp: any) => {
        console.log(resp)
        if (resp.status === 'Success' && resp.code === 200 && resp.data === 'S') {
          this._loaderService.hideLoader();
          this._popupService.openAlert({
            header: 'Success',
            message: 'Your reply has been posted successfully!'
          });
          this.dialogRef.close();
        } else {
          this._loaderService.hideLoader();
          this._popupService.openAlert({
            header: 'Fail',
            message: 'Error while posting your reply!'
          })
        }

      }, error: (err: any) => {
        this._loaderService.hideLoader();
        console.log(`error while posting reply`)
        console.log(err);
        this._popupService.openAlert({
          header: 'Fail',
          message: 'Error while posting your reply!'
        })
      }
    })
  }

}
