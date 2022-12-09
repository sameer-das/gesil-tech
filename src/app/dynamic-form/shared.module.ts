import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { DynamicFormComponent } from './dynamic-form.component';

@NgModule({
    declarations: [DynamicFormComponent],
    imports: [CommonModule, MaterialModule, ReactiveFormsModule],
    exports: [DynamicFormComponent]
})
export class SharedModule {
    constructor() { }
}