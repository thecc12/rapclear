// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { MatCardModule, MatDialogModule, MatDividerModule, MatExpansionModule, MatFormFieldModule, MatGridListModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, MatTableModule, MatTabsModule } from '@angular/material';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AdminRoutingModule } from './admin-routing.module';
import { ListsUserComponent } from './users/lists-user/lists-user.component';
import { InputEmailSearchComponent } from './input-email-search/input-email-search.component';
import { ListUserComponent } from './list-user/list-user.component';
// import { TabsModule } from '../../components/tabs/tabs.module';
import { UserProfilComponent } from './user-profil/user-profil.component';
import { CdkTableModule } from '@angular/cdk/table';
import { UserAdminPanelComponent } from './user-admin-panel/user-admin-panel.component';
import { UserAddInvestmentComponent } from './user-add-investment/user-add-investments.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserTransferInvestmentComponent } from './user-transfer-investment/user-transfer-investment.component';
import { PanelComponent } from './panel/panel.component';
import { InvestmentsPanelComponent } from './investments-panel/investments-panel.component';
import { InvestmentsAdminActionComponent } from './investment-admin-action/investments-admin-action.component';
import { SplitAdminInvestmentComponent } from './split-admin-investment/split-admin-investment.investment';
import { SettingsAdminComponent } from './settings-admin/settings-admin.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AdminTimerpickerComponent } from './admin-timerpicker/admin-timerpicker.component';
import { AdminRangeTimerpickerComponent } from './admin-range-timerpicker/admin-range-timerpicker.component';
import { GainComponent } from './gain/gain.component';
import { GainInputComponent } from './gain-input/gain-input.component';
import { SpinnerModule } from '../components/spinner/spinner.module';
import { AddInvestmentComponent } from './investment/add-investment/add-investment.component';
import { ListsInvestmentComponent } from './investment/lists-investment/lists-investment.component';
import { UserInvestmentsListComponent } from './user-investments-list/user-investments-list.component';
import { UserInvestmentsComponent } from './user-investments/user-investments.component';
import { TabsModule } from '../tabs/tabs.module';
import { ChartsModule } from 'ng2-charts';
import { RequestsAdminActionComponent } from './request-admin-action/requests-admin-action.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    ChartsModule,
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
    NgbModule
  ],
  declarations: [
    ListsUserComponent,
    AddInvestmentComponent,
    ListsInvestmentComponent,
    UserAdminPanelComponent,
    InputEmailSearchComponent,
    ListUserComponent,
    UserProfilComponent,
    UserInvestmentsComponent,
    UserInvestmentsListComponent,
    UserAddInvestmentComponent,
    UserTransferInvestmentComponent,
    PanelComponent,
    InvestmentsPanelComponent,
    InvestmentsAdminActionComponent,
    SplitAdminInvestmentComponent,
    SettingsAdminComponent,
    AdminTimerpickerComponent,
    AdminRangeTimerpickerComponent,
    GainComponent,
    GainInputComponent,
    RequestsAdminActionComponent
  ],
  exports: [
  ],
  entryComponents: [
    UserAddInvestmentComponent,
    UserTransferInvestmentComponent,
    SplitAdminInvestmentComponent
  ]
})
export class AdminModule { }
