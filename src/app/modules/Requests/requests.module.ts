import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { RequestsRoutingModule } from './requests-routing.module';
import { AddRequestComponent } from './add-request/add-request.component';
import { RequestRejectedComponent } from './request-rejected/request-rejected.component';
import { RequestValidedComponent } from './request-valided/request-valided.component';
import { RequestPanelComponent } from './request-panel/request-panel.component';
import { CommonModule } from '@angular/common';
import { ProgressIndeterminateModule } from '../components/progress-indeterminate/progress-indeterminate.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SpinnerModule } from '../components/spinner/spinner.module';
import { CdkTableModule } from '@angular/cdk/table';
// tslint:disable-next-line:max-line-length
import { MatListModule, MatIconModule, MatCardModule, MatInputModule, MatGridListModule, MatFormFieldModule, MatDividerModule, MatTabsModule, MatExpansionModule, MatPaginatorModule, MatTableModule, MatDialogModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { RequestInitiatedComponent } from './request-initiated/request-initiated.component';
import { ListRequestComponent } from '../components/list-request/list-request.component';

@NgModule({
  imports: [
    FormsModule,
    RequestsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    SpinnerModule,
    ProgressIndeterminateModule,
    TimepickerModule.forRoot(),
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTabsModule,
    TabsModule,
    MatExpansionModule,
    CdkTableModule,
    MatPaginatorModule,
    MatTableModule,
    MatDialogModule,
    NgbModule,
    ProgressIndeterminateModule
  ],
  declarations: [
    RequestInitiatedComponent,
    AddRequestComponent,
    RequestRejectedComponent,
    RequestValidedComponent,
    RequestPanelComponent,
    ListRequestComponent

  ]
})
export class RequestsModule { }
