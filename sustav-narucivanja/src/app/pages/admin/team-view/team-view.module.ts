import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamViewComponent } from './team-view.component';
import { SingleTeamModule } from 'src/app/components/single-team/single-team.module';

@NgModule({
  declarations: [TeamViewComponent],
  imports: [CommonModule, SingleTeamModule],
  exports: [TeamViewComponent],
})
export class TeamViewModule {}
