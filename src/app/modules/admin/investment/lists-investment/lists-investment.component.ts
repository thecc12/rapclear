import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Investment } from '../../../../entity/investment';
import { BasicInvestmentService } from '../../../../services/investment/basic-investment.service';
import { NotificationService } from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-lists-investment',
  templateUrl: './lists-investment.component.html',
  styleUrls: ['./lists-investment.component.scss']
})
export class ListsInvestmentComponent implements OnInit {

  investments: { waitResponse: boolean, investment: Investment }[] = [];
  search = '';
  searchInvestments: { waitResponse: boolean, investment: Investment }[] = [];

  constructor(private investmentService: BasicInvestmentService, private notifService: NotificationService) { }

  ngOnInit() {
    this.getInvestments();
  }

  getInvestments() {
    // this.investmentService.investmentList.subscribe((investments: Map<string, Investment>) => {
    //   this.investments = Array.from(investments.values()).map((investment) => {
    //     return { waitResponse: false, investment };
    //   });
    //   this.searchInvestment();
    // });
  }

  deleteInvestment(id) {
    // this.investmentService.deleteInvestment(id)
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  }

  changeStatusMarket(investment) {
    // investment.waitResponse = true;
    // this.investmentService.changeStatusMarket(investment.investment)
    //   .then((result) => {
    //     investment.waitResponse = false;
    //     this.notifService.showNotification('top', 'center', 'success', '', `\<b>Success !\</b>\<br>The market status of the investment has been updated to '${investment.investment.status}'`);
    //   })
    //   .catch((error) => {
    //     investment.waitResponse = false;
    //     this.notifService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);
    //   });
  }
  searchInvestment() {
    this.searchInvestments = _.filter(this.investments, (investment) => _.includes(investment.investment.idOwner, this.search) ||
      _.includes(investment.investment.amount, this.search) ||
      _.includes(investment.investment.state, this.search));
  }

}
