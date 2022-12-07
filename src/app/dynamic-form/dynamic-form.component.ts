import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges {

  constructor() { }
  @Input('params') params!: any[];
  ngOnInit(): void { }
  
  ngOnChanges(changes: SimpleChanges): void {
    
  }




}
