import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MyTeamComponent } from './my-team/my-team.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: MyTeamComponent, canActivate: [] },
];

@NgModule({
  declarations: [
    MyTeamComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,RouterModule.forChild(routes)
  ]
})
export class MyTeamModule { }
