import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, MainNavigationModule, MainFooterModule],
  exports: [HomeComponent],
})
export class HomeModule {}
