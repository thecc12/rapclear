import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddRequestComponent } from './add-request/add-request.component';
import { RequestPanelComponent } from './request-panel/request-panel.component';
import { RequestRejectedComponent } from './request-rejected/request-rejected.component';
import { RequestValidedComponent } from './request-valided/request-valided.component';

import { RequestWatingComponent } from './request-wating/request-wating.component';

const routes: Routes = [
  {
    path: '',
    component: RequestPanelComponent,
    data: {
      title: 'Requests'
    }
  },
  {
    path: 'add-request',
    component: AddRequestComponent,
    data: {
      title: 'Add-request'
    }
  },
  {
    path: 'request-wating',
    component: RequestWatingComponent,
    data: {
      title: 'valided-request'
    }
  },
  {
    path: 'request-panel',
    component: RequestPanelComponent,
    data: {
      title: 'Request Panel'
    }
  },
  {
    path: 'request-rejected',
    component: RequestRejectedComponent,
    data: {
      title: 'rejected-request'
    }
  },
  {
    path: 'request-valided',
    component: RequestValidedComponent,
    data: {
      title: 'valided-request'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule {}
