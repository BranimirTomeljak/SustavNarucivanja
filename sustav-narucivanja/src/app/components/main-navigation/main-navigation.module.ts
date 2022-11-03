import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainNavigationComponent } from './main-navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MainNavigationComponent],
  imports: [CommonModule, MatToolbarModule, RouterModule, MatButtonModule],
  exports: [MainNavigationComponent],
})
export class MainNavigationModule {}
