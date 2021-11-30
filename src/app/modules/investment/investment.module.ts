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

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InvestmentRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    SpinnerModule
  ],
  declarations: [
    AddInvestmentComponent,
    ListsInvestmentComponent,
  ],
  providers: [
    BasicInvestmentService],
})
export class InvestmentModule { }
