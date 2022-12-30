import { ComponentFactoryResolver, Directive, HostListener, OnDestroy, ViewContainerRef } from "@angular/core";
import { ModalComponent } from "./modal.component";
import ModalService from "./modal.service";

@Directive({
    selector: '[openModal]'
})
export default class OpenModalDirective {
    constructor(private viewContainerRef:ViewContainerRef, private modalService : ModalService) {  }

    @HostListener('click')
    openModal(){
        this.modalService.open(this.viewContainerRef)
    }
}

/*
npm i @angular/material@14.2.7
npm i @angular/cdk@14.2.7
npm i @angular/animations@14.2.12

in app module 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
and add BrowserAnimationsModule to import array 


in index.html
 <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">


in app module
 import {MatButtonModule} from '@angular/material/button';
 and add MatButtonModule to imports array 

 then add below html in one tpl or jsp to check 
 <button mat-raised-button color="primary">Primary</button>
*/