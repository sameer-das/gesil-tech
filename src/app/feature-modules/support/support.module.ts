import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { ListTicketsComponent } from './list-tickets/list-tickets.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SupportService } from './support.service';
import { ReplyPopupComponent } from './reply-popup/reply-popup.component';



@NgModule({
  declarations: [
    CreateTicketComponent,
    ListTicketsComponent,
    ReplyPopupComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild([{
      path: '', component: ListTicketsComponent,
    },
    { path: 'create', component: CreateTicketComponent },
    { path: 'list', redirectTo: '' }
    ])
  ],
})
export class SupportModule { }
