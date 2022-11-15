import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthNavigationComponent } from './auth-navigation.component';

@NgModule({
  declarations: [AuthNavigationComponent],
  imports: [CommonModule],
  exports: [AuthNavigationComponent],
})
export class AuthNavigationModule {}
