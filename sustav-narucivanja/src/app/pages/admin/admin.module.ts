import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, MainNavigationModule, MatButtonModule, RouterModule],
  exports: [AdminComponent],
})
export class AdminModule {}
