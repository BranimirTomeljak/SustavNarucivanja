import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleTeamComponent } from './single-team.component';
import { MainNavigationModule } from '../main-navigation/main-navigation.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SingleTeamComponent],
  imports: [CommonModule, MainNavigationModule, MatButtonModule],
  exports: [SingleTeamComponent],
})
export class SingleTeamModule {}
