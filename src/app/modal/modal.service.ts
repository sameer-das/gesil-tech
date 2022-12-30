import { Injectable, ViewContainerRef } from "@angular/core";
import { Subject } from "rxjs";
import { ModalComponent } from "./modal.component";
@Injectable()
export default class ModalService {
    constructor(){}

    private sub: Subject<string> = new Subject<string>()

    close() {
        this.sub.next('closed');
    }

    open(vcr:ViewContainerRef){
        vcr.clear();
        vcr.createComponent(ModalComponent);
        this.sub.subscribe(x => {
            vcr.clear();
        })
    }
}