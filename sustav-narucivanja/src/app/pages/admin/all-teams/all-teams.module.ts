import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllTeamsComponent } from './all-teams.component';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AllTeamsComponent],
  imports: [CommonModule, MainNavigationModule, RouterModule],
  exports: [AllTeamsComponent],
})
export class AllTeamsModule {}
