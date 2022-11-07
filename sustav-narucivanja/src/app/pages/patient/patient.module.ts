import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { PatientComponent } from './patient.component';
import { KalendarModule } from 'src/app/components/kalendar/kalendar.module';

@NgModule({
  declarations: [PatientComponent],
  imports: [
    CommonModule,
    MainNavigationModule,
    MainFooterModule,
    KalendarModule,
  ],
  exports: [PatientComponent],
})
export class PatientModule {}
