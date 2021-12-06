// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FamillyComponent } from './familly/familly.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

import { FamillyRoutingModule } from './familly-routing.module';
import { SpinnerModule } from '../components/spinner/spinner.module';

@NgModule({
  imports: [
    FamillyRoutingModule,
    CommonModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    SpinnerModule
  ],
  declarations: [
    FamillyComponent,
  ]
})
export class FamillyModule { }
