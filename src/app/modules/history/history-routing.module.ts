import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryComponent } from './history/history.component';

const routes: Routes = [
  {
    path: '',
    component: HistoryComponent,
    data: {
      title: 'history'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule { }
