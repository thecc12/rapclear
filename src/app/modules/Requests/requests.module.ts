import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { RequestWatingComponent } from './request-wating/request-wating.component';
import { RequestsRoutingModule } from './requests-routing.module';
import { AddRequestComponent } from './add-request/add-request.component';
import { RequestRejectedComponent } from './request-rejected/request-rejected.component';
import { RequestValidedComponent } from './request-valided/request-valided.component';
import { RequestPanelComponent } from './request-panel/request-panel.component';
import { CommonModule } from '@angular/common';
import { ProgressIndeterminateModule } from '../components/progress-indeterminate/progress-indeterminate.module';

@NgModule({
  imports: [
    FormsModule,
    RequestsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressIndeterminateModule
  ],
  declarations: [
    RequestWatingComponent,
    AddRequestComponent,
    RequestRejectedComponent,
    RequestValidedComponent,
    RequestPanelComponent
  ]
})
export class RequestsModule { }
