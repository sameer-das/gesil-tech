import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private _http: HttpClient) { }

  private readonly URL_POST_TICKET_INFO = `${environment.service_base_url}/api/User/PostTicketInfo`;
  postTicketInfo(ticket: any) {
    return this._http.post(this.URL_POST_TICKET_INFO, ticket);
  }

  private readonly URL_POST_TICKET_REPLY = `${environment.service_base_url}/api/User/PostTicketReplyInfo`;
  postTicketReply(reply: any) {
    return this._http.post(this.URL_POST_TICKET_REPLY, reply);
  }

  private readonly URL_GET_ALL_TICKETS = `${environment.service_base_url}/api/User/GetSupportDetails`;
  getAllTickets(emailid: string) {
    return this._http.get(`${this.URL_GET_ALL_TICKETS}?email=${emailid}`);
  }

}
