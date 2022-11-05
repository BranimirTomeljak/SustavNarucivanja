import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateUserModule } from 'src/app/components/create-user/create-user.module';
import { DoctorComponent } from './doctor.component';

@NgModule({
  declarations: [DoctorComponent],
  imports: [CommonModule, CreateUserModule],
  exports: [DoctorComponent],
})
export class DoctorModule {}
