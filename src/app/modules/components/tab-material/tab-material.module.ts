import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMaterialComponent } from './tab-material.component';
import { TabItemComponent } from './tab-item/tab-item.component';



@NgModule({
  declarations: [
    TabMaterialComponent,
    TabItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TabMaterialComponent,
    TabItemComponent
  ]
})
export class TabMaterialModule { }
