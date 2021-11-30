// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HistoryComponent } from './history/history.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

import { HistoryRoutingModule } from './history-routing.module';

@NgModule({
  imports: [
    HistoryRoutingModule,
    CommonModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    HistoryComponent,
  ]
})
export class HistoryModule { }
