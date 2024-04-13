
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges {

  constructor(private _fb: FormBuilder) { }
  @Input('params') params!: any[];
  @Input('disableCta') disableCta!: boolean;
  @Input('isBillFetchRequired') isBillFetchRequired!: boolean;
  @Input('prePopulateValue') prePopulateValue!: any;
  @Input('prePopulateAmount') prePopulateAmount!: string;
  
  dynamicForm!: FormGroup;
  @Output() formSubmmited = new EventEmitter();




  ngOnInit(): void { 

    this.createForm();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes)
  }

  createForm(){
    const obj:any = {};
    this.params.forEach((curr:any) => {
      console.log(curr);
      console.log(this.prePopulateValue);
      let valueToBePatched = '';
      if(this.prePopulateValue) {
        const found = this.prePopulateValue.find((elem: any) => elem.paramName === curr.paramName.replace(new RegExp('/', 'g'), ''));
        if(found) {
          valueToBePatched = found.paramValue;
        } else {
          valueToBePatched = ''
        }
      }
      obj[curr.paramName] = curr.isOptional ? new FormControl(valueToBePatched) : new FormControl(valueToBePatched,[Validators.required]);
    })

    if(!this.isBillFetchRequired) {
      // if billfetch is not required then directly go for bill payment 
      // no need to fetch bill
      // For DTH services
      const isAmountFieldAlreadyPresent = this.params.findIndex(curr => curr.paramName === 'Amount') >= 0;
      // console.log(isAmountFieldAlreadyPresent)
      if(!isAmountFieldAlreadyPresent) {
        obj['Amount'] = new FormControl(this.prePopulateAmount ? this.prePopulateAmount : '',[Validators.required]);
      }
    }
    this.dynamicForm = this._fb.group(obj);

  }

  
  public get getControls() : any[] {
    const arr = Object.keys(this.dynamicForm.controls);
    //  console.log(arr);
     return arr;

  }
  
  onFormSubmit(){
    if(this.dynamicForm.status === 'VALID') {
      this.formSubmmited.emit(this.dynamicForm.value);
    }

  }


}
