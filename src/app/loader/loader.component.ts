import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(private _loaderService: LoaderService) { }

  disp: Observable<string> = this._loaderService.$dispObs;

  ngOnInit(): void {
  }

}
