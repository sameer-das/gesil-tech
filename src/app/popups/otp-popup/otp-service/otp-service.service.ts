import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

    private $subject = new Subject<boolean>();
    
    sendOtp() {
        this.$subject.next(true);
    }

    onSendOtp(){
        return this.$subject.asObservable();
    }
}
