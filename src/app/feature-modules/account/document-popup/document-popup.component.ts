import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-document-popup',
  templateUrl: './document-popup.component.html',
  styleUrls: ['./document-popup.component.scss']
})
export class DocumentPopupComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private mdDialogRef: MatDialogRef<DocumentPopupComponent>
  ) { }

  imageSrc: string = `https://api.esebakendra.com/api/User/Download?fileName=`;

  ngOnInit(): void {
    this.imageSrc += this.data; 
    console.log(this.data)
  }

}
