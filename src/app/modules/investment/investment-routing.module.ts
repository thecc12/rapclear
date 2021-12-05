import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddInvestmentComponent } from './add-investment/add-investment.component';
import { ConfirmedInvestmentComponent } from './confirmed-investment/confirmed-investment.component';
import { InitiatedInvestmentComponent } from './initiated-investment/initiated-investment.component';
import { ListsInvestmentComponent } from './lists-investment/lists-investment.component';


const routes: Routes = [
  {
    path: '',
    component: AddInvestmentComponent,
    data: {
      title: 'Add Investment'
    }
  },
  {
    path: 'add',
    component: AddInvestmentComponent,
    data: {
      title: 'Add Investment'
    }
  },
  {
    path: 'initiated',
    component: InitiatedInvestmentComponent,
    data: {
      title: 'initiated Investment'
    }
  },
  {
    path: 'confirmed',
    component: ConfirmedInvestmentComponent,
    data: {
      title: 'Confirmed Investment'
    }
  },
  // {
  //   path: 'list',
  //   // component: ListsInvestmentComponent,
  //   data: {
  //     title: 'List of investment'
  //   },
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentRoutingModule { }
