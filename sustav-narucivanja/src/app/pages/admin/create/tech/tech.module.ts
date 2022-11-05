import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechComponent } from './tech.component';
import { CreateUserModule } from 'src/app/components/create-user/create-user.module';

@NgModule({
  declarations: [TechComponent],
  imports: [CommonModule, CreateUserModule],
  exports: [TechComponent],
})
export class TechModule {}
