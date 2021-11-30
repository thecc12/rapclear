import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FamillyComponent } from './familly/familly.component';

const routes: Routes = [
  {
    path: '',
    component: FamillyComponent,
    data: {
      title: 'Referral'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FamillyRoutingModule { }
