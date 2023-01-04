import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { KalendarModule } from 'src/app/components/kalendar/kalendar.module';
import { DoctorPageComponent } from './doctor-page.component';

@NgModule({
  declarations: [DoctorPageComponent],
  imports: [
    CommonModule,
    MainNavigationModule,
    MainFooterModule,
    KalendarModule,
  ],
  exports: [DoctorPageComponent],
})
export class DoctorPageModule {}
