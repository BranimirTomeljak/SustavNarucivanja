import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams.component';
import { TeamFormModule } from 'src/app/components/team-form/team-form.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';

@NgModule({
  declarations: [TeamsComponent],
  imports: [CommonModule, TeamFormModule, MainNavigationModule],
  exports: [TeamsComponent],
})
export class TeamsModule {}
