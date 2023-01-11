import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { KalendarModule } from 'src/app/components/kalendar/kalendar.module';
import { DefineRulesDialog, DoctorPageComponent} from './doctor-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import {MatBadgeModule} from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RecordAttendanceDialogModule } from 'src/app/components/record-attendance-dialog/record-attendance-dialog.module';

@NgModule({
  declarations: [DoctorPageComponent, DefineRulesDialog],
  imports: [
    CommonModule,
    MainNavigationModule,
    MainFooterModule,
    KalendarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule,
    RecordAttendanceDialogModule,
    MatBadgeModule,
    MatFormFieldModule,
    FormsModule
  ],
  exports: [DoctorPageComponent],
})
export class DoctorPageModule {}
