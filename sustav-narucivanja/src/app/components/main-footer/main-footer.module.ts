import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainFooterComponent } from './main-footer.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [MainFooterComponent],
  imports: [CommonModule, MatCardModule],
  exports: [MainFooterComponent],
})
export class MainFooterModule {}
