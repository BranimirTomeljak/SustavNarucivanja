import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NurseWorkingHoursComponent } from './nurse-working-hours.component';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthNavigationModule } from 'src/app/components/auth-navigation/auth-navigation.module';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [NurseWorkingHoursComponent],
  imports: [
    CommonModule,
    AuthNavigationModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    RouterModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MainNavigationModule,
    MainFooterModule,
  ],
  exports: [NurseWorkingHoursComponent],
})
export class NurseWorkingHoursModule {}
