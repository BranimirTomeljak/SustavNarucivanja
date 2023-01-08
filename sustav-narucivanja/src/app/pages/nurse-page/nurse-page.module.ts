import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { KalendarModule } from 'src/app/components/kalendar/kalendar.module';
import { NursePageComponent } from './nurse-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [NursePageComponent],
  imports: [
    CommonModule,
    MainNavigationModule,
    MainFooterModule,
    KalendarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule
  ],
  exports: [NursePageComponent],
})
export class NursePageModule {}
