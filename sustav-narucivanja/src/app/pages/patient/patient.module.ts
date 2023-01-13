import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { MedicalServiceDialog, PatientComponent } from './patient.component';
import { KalendarModule } from 'src/app/components/kalendar/kalendar.module';
import {MatBadgeModule} from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioButton, MatRadioModule} from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AcceptChangeDialogModule } from 'src/app/components/accept-change-dialog/accept-change-dialog.module';


@NgModule({
  declarations: [PatientComponent, MedicalServiceDialog],
  imports: [
    CommonModule,
    MainNavigationModule,
    MainFooterModule,
    KalendarModule,
    MatBadgeModule,
    MatDialogModule,
    MatDialogModule,
    AcceptChangeDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatButtonModule
  ],
  exports: [PatientComponent],
})
export class PatientModule {}
