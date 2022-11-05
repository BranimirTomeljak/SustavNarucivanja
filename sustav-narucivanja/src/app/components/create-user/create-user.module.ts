import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUserComponent } from './create-user.component';

@NgModule({
  declarations: [CreateUserComponent],
  imports: [CommonModule],
  exports: [CreateUserComponent],
})
export class CreateUserModule {}
