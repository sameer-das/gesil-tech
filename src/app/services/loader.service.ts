import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private readonly $dispSub: BehaviorSubject<string> = new BehaviorSubject('none');
  public $dispObs = this.$dispSub.asObservable();


  public showLoader(): void {
    this.$dispSub.next('block');
  }
  public hideLoader(): void {
    this.$dispSub.next('none');
  }
}
