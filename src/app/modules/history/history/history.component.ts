import { Component, OnInit } from '@angular/core';
import { Investment, InvestmentState } from '../../../entity/investment';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserHistoryService } from '../../../services/user-history/user-history.service';


@Component({
  templateUrl: 'history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent implements OnInit {
  waitData=true;
  investments: Investment[] = [];
  listHistoryInvestments: Map<string, boolean> = new Map<string, boolean>();
  numHistoryInvestment: number = 0;

  constructor(private notification: NotificationService,
    private history: UserHistoryService) {
      this.waitData=true;
  }

  ngOnInit() {
    this.getInvestmentsHistory();
  }

  getInvestmentsHistory() {
    this.history.history.subscribe((investment: Investment[]) => {
  // console.log("listory ",investment)
      this.investments = investment
      // .filter((p: Investment) => !this.listHistoryInvestments.has(p.id.toString().toString()))
        .map((p: Investment) => {
          // tslint:disable-next-line:prefer-const
          let nInvestment = new Investment();
          nInvestment.hydrate(p.toString());
          // this.listHistoryInvestments.set(nInvestment.id.toString().toString(), true);
          nInvestment.paymentDate = (new Date(nInvestment.paymentDate)).toLocaleDateString();
          this.waitData=false;
          return nInvestment;
        });
    });
  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
  getStatusLabel(history:Investment):String
  {
    if(history.investmentState==InvestmentState.PAYED) return "payed";
    if(history.investmentState==InvestmentState.REFUSE) return "rejected";
    return ""
  }
}
