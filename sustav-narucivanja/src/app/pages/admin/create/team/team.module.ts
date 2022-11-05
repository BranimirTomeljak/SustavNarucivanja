import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team.component';
import { TeamFormModule } from 'src/app/components/team-form/team-form.module';

@NgModule({
  declarations: [TeamComponent],
  imports: [CommonModule, TeamFormModule],
  exports: [TeamComponent],
})
export class TeamModule {}
