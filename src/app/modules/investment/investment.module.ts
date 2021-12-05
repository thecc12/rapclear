// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Alert Component
import { AlertModule } from 'ngx-bootstrap/alert';
// import { UserComponent } from './user/user.component';

// Modal module
import { ModalModule } from 'ngx-bootstrap/modal';

// Notifications Routing
import { InvestmentRoutingModule } from './investment-routing.module';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddInvestmentComponent } from './add-investment/add-investment.component';
import { ListsInvestmentComponent } from './lists-investment/lists-investment.component';
import { SpinnerComponent } from '../components/spinner/spinner.component';
import { BasicInvestmentService } from '../../services/investment/basic-investment.service';
import { SpinnerModule } from '../components/spinner/spinner.module';
import { InitiatedInvestmentComponent } from './initiated-investment/initiated-investment.component';
import { ConfirmedInvestmentComponent } from './confirmed-investment/confirmed-investment.component';
import { ChartsModule } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InvestmentRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    SpinnerModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [
    AddInvestmentComponent,
    ListsInvestmentComponent,
    InitiatedInvestmentComponent,
    ConfirmedInvestmentComponent
  ],
  providers: [
    BasicInvestmentService],
})
export class InvestmentModule { }
