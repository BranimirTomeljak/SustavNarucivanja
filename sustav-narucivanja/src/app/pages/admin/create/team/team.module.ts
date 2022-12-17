import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team.component';
import { TeamFormModule } from 'src/app/components/team-form/team-form.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthNavigationModule } from 'src/app/components/auth-navigation/auth-navigation.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [TeamComponent],
  imports: [
    CommonModule,
    TeamFormModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MainNavigationModule,
    MatAutocompleteModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    MatSnackBarModule
    ],
  exports: [TeamComponent],
})
export class TeamModule {
}
