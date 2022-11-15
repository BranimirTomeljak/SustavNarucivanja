import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainFooterModule } from 'src/app/components/main-footer/main-footer.module';
import { MainNavigationModule } from 'src/app/components/main-navigation/main-navigation.module';
import { HomeComponent } from './home.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthNavigationModule } from 'src/app/components/auth-navigation/auth-navigation.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MainNavigationModule,
    MainFooterModule,
    MatButtonModule,
    AuthNavigationModule,
    MatCardModule,
    MatCardModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
