import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CcMainPageComponent } from './cc-main-page/cc-main-page.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CCAvenueService } from './ccavenue.service';
import { CcSuccessComponent } from './cc-success/cc-success.component';
import { CcFailComponent } from './cc-fail/cc-fail.component';



@NgModule({
  declarations: [
    CcMainPageComponent,
    CcSuccessComponent,
    CcFailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: CcMainPageComponent },
      { path: 'ccsuccess', component: CcSuccessComponent },
      { path: 'ccfail', component: CcFailComponent},

    ])
  ],
  providers:[CCAvenueService]
})
export class CcavenueModule { }
