import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import ModalService from './modal.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnDestroy {

  constructor(private modalService:ModalService) { }
  ngOnDestroy(): void {
    console.log('modal destroyed');
  }

  ngOnInit(): void {
    console.log('modal opened');
  }

  onClose() {
    this.modalService.close();
  }
}
