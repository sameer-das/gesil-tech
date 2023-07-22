
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    constructor(){}

    personalInfoChanged$: Subject<void> = new Subject<void>();
}