import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleTeamComponent } from './single-team.component';
import { MainNavigationModule } from '../main-navigation/main-navigation.module';
import { MatButtonModule } from '@angular/material/button';
import { TeamFormModule } from '../team-form/team-form.module';

@NgModule({
  declarations: [SingleTeamComponent],
  imports: [
    CommonModule,
    MainNavigationModule,
    MatButtonModule,
    TeamFormModule,
  ],
  exports: [SingleTeamComponent],
})
export class SingleTeamModule {}
