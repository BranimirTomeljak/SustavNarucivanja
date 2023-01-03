import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamViewComponent } from './team-view.component';
import { SingleTeamModule } from 'src/app/components/single-team/single-team.module';
import { TeamFormModule } from 'src/app/components/team-form/team-form.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';

@NgModule({
  declarations: [TeamViewComponent],
  imports: [
    CommonModule,
    SingleTeamModule,
    TeamFormModule,
    MainNavigationModule,
  ],
  exports: [TeamViewComponent],
})
export class TeamViewModule {}
