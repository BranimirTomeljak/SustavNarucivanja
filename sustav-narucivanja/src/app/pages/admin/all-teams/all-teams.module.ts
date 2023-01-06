import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllTeamsComponent } from './all-teams.component';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AllTeamsComponent],
  imports: [
    CommonModule,
    MainNavigationModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [AllTeamsComponent],
})
export class AllTeamsModule {}
