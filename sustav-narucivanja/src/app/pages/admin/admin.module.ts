import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, MainNavigationModule],
  exports: [AdminComponent],
})
export class AdminModule {}
