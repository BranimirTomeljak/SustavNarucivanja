import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamViewComponent } from './team-view.component';
import { SingleTeamModule } from 'src/app/components/single-team/single-team.module';
import { TeamFormModule } from 'src/app/components/team-form/team-form.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TeamViewComponent],
  imports: [
    CommonModule,
    SingleTeamModule,
    TeamFormModule,
    MainNavigationModule,
    MatButtonModule,
    RouterModule,
  ],
  exports: [TeamViewComponent],
})
export class TeamViewModule {}
