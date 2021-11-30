import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressIndeterminateComponent } from './progress-indeterminate.component';



@NgModule({
  declarations: [
    ProgressIndeterminateComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[ProgressIndeterminateComponent]
})
export class ProgressIndeterminateModule { }
