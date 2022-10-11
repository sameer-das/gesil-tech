import { NgModule } from '@angular/core';

import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
const MATERIAL = [
  MatDialogModule,
  MatTabsModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatStepperModule,
  MatCardModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatToolbarModule,
  MatMenuModule,
  MatBadgeModule,
  MatSidenavModule,
  MatListModule,
  MatTreeModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatExpansionModule
];

@NgModule({
  declarations: [],
  imports: MATERIAL,
  exports: MATERIAL,
})
export class MaterialModule {}
