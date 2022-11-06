import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { PatientComponent } from './patient.component';
import { CalendarHeaderModule } from 'src/app/components/calendar-header/calendar-header.module';

@NgModule({
  declarations: [PatientComponent],
  imports: [
    CommonModule,
    MainNavigationModule,
    MainFooterModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CalendarHeaderModule
  ],
  exports: [PatientComponent],
})
export class PatientModule {}
