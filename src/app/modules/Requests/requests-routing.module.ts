import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestsComponent } from './requests.component';

const routes: Routes = [
  {
    path: '',
    component: RequestsComponent,
    data: {
      title: 'Requests'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule {}
