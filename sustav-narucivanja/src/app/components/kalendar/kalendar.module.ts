import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CancelAppointmentDialog, KalendarComponent, ReserveAppointmentDialog, ChangeAppointmentDialog } from './kalendar.component';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    KalendarComponent,
    ReserveAppointmentDialog,
    CancelAppointmentDialog,
    ChangeAppointmentDialog,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatDialogModule
  ],
  exports: [KalendarComponent],
})
export class KalendarModule {}
