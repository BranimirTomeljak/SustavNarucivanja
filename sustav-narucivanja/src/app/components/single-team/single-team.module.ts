import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleTeamComponent } from './single-team.component';
import { MainNavigationModule } from '../main-navigation/main-navigation.module';

@NgModule({
  declarations: [SingleTeamComponent],
  imports: [CommonModule, MainNavigationModule],
  exports: [SingleTeamComponent],
})
export class SingleTeamModule {}
