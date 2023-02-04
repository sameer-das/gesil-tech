import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReplyPopupComponent } from '../reply-popup/reply-popup.component';
import { SupportService } from '../support.service';

@Component({
  selector: 'app-list-tickets',
  templateUrl: './list-tickets.component.html',
  styleUrls: ['./list-tickets.component.scss']
})
export class ListTicketsComponent implements OnInit {

  constructor(private _matDialog:MatDialog, private _supportService:SupportService) { }
  currentUser: any = JSON.parse(localStorage.getItem('auth') || '{}');
  tickets:any[] = [];
  ngOnInit(): void {
    this._supportService.getAllTickets(this.currentUser.user.user_EmailID).subscribe({
      next: (resp:any) => {
        console.log(resp)
        if(resp.status === "Success" && resp.code === 200) {
          this.tickets = resp.data;
          console.log(this.tickets)
        } else {
          
        }
      }, error: (err:any) => {
        console.log(`error while getting all the tickets`);
        console.log(err);
        this.tickets = [];
      }
    })
  }

  openReplyDialog() {
    this._matDialog.open(ReplyPopupComponent, {disableClose: true, minWidth:'400px', data: 1});
  }

}
