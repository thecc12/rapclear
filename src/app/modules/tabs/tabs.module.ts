import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs/tabs.component';
import { TabItemComponent } from './tab-item/tab-item.component';


@NgModule({
  declarations: [TabsComponent, TabItemComponent],
  imports: [
    CommonModule,
    
  ],
  exports:[TabsComponent,TabItemComponent]
})
export class TabsModule { }
