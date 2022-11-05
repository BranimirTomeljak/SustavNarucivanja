import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorComponent } from './doctor.component';

@NgModule({
  declarations: [DoctorComponent],
  imports: [CommonModule],
  exports: [DoctorComponent],
})
export class DoctorModule {}
