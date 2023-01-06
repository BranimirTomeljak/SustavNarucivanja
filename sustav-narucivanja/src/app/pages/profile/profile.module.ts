import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, MainNavigationModule],
  exports: [ProfileComponent],
})
export class ProfileModule {}
