import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CancelAppointmentDialog, KalendarComponent, ReserveAppointmentDialog, ChangeAppointmentDialog, FreeAppointmentDialog } from './kalendar.component';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatDialogModule } from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    KalendarComponent,
    ReserveAppointmentDialog,
    CancelAppointmentDialog,
    ChangeAppointmentDialog,
    FreeAppointmentDialog
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
    MatDialogModule,
    MatRadioModule
  ],
  exports: [KalendarComponent],
})
export class KalendarModule {}
