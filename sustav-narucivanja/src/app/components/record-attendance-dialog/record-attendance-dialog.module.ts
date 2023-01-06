import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { KalendarModule } from 'src/app/components/kalendar/kalendar.module';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { RecordAttendanceDialogComponent } from './record-attendance-dialog.component';

@NgModule({
  declarations: [RecordAttendanceDialogComponent],
  imports: [
    CommonModule,
    MainNavigationModule,
    MainFooterModule,
    KalendarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule
  ],
  exports: [RecordAttendanceDialogComponent],
})
export class RecordAttendanceDialogModule {}
