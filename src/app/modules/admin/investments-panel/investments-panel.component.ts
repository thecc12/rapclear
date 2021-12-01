import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { merge } from 'rxjs';
import { EntityID } from '../../../entity/EntityID';
import { Investment } from '../../../entity/investment';
import { DataStateUpdateService } from '../../../services/data-state-update/data-state-update.service';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { BasicInvestmentService } from '../../../services/investment/basic-investment.service';
import { MarketService } from '../../../services/market/market.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-investments-panel',
  templateUrl: './investments-panel.component.html',
  styleUrls: ['./investments-panel.component.css']
})
export class InvestmentsPanelComponent implements OnInit {
  listAllInvestment: Investment[] = [];
  listAllInvestmentCheck: Map<string, boolean> = new Map<string, boolean>();

  listInitiatedInvestment: Investment[] = [];
  listInitiatedInvestmentCheck: Map<string, boolean> = new Map<string, boolean>();

  listPayedInvestment: Investment[] = [];
  listPayedInvestmentCheck: Map<string, boolean> = new Map<string, boolean>();

  listWaitingPaymentDateInvestment: Investment[] = [];
  listWaitingPaymentDateInvestmentCheck: Map<string, boolean> = new Map<string, boolean>();

  listReadyToPayInvestment: Investment[] = [];
  listReadyToPayInvestmentCheck: Map<string, boolean> = new Map<string, boolean>();



  waitResponseSecondBtn: boolean = false;
  waitResponseBtn: boolean = false;



  selectedInvestmentId: String = '';
  constructor(
    private marketService: MarketService,
    private userService: UserService,
    private notificationService: NotificationService,
    private basicInvestmentService: BasicInvestmentService,
    private dataUpdateService: DataStateUpdateService,
    private dialog: BsModalService
  ) { }

  ngOnInit(): void {
    this.marketService.getAllInitiatedInvestment().subscribe((investment: Investment) => {
      if (!this.listInitiatedInvestmentCheck.has(investment.id.toString().toString())) {
        this.listInitiatedInvestmentCheck.set(investment.id.toString().toString(), true);
        this.listInitiatedInvestment.push(investment);
      }
    });

    this.marketService.getAllWaitingPaymentDateInvestment().subscribe((investment: Investment) => {
      if (!this.listWaitingPaymentDateInvestmentCheck.has(investment.id.toString().toString())) {
        this.listWaitingPaymentDateInvestmentCheck.set(investment.id.toString().toString(), true);
        this.listWaitingPaymentDateInvestment.push(investment);
      }
    });

    this.marketService.getAllReadyToPayInvestment().subscribe((investment: Investment) => {
      if (!this.listReadyToPayInvestmentCheck.has(investment.id.toString().toString())) {
        this.listReadyToPayInvestmentCheck.set(investment.id.toString().toString(), true);
        this.listReadyToPayInvestment.push(investment);
      }
    });

    this.marketService.getAllPayedInvestment().subscribe((investment: Investment) => {
      if (!this.listPayedInvestmentCheck.has(investment.id.toString().toString())) {
        this.listPayedInvestmentCheck.set(investment.id.toString().toString(), true);
        this.listPayedInvestment.push(investment);
      }
    });

    merge(this.marketService.getAllInitiatedInvestment(), this.marketService.getAllWaitingPaymentDateInvestment())
    .subscribe((investment: Investment) => {
      if (!this.listAllInvestmentCheck.has(investment.id.toString().toString())) {
        this.listAllInvestmentCheck.set(investment.id.toString().toString(), true);
        this.listAllInvestment.push(investment);
      }
    });
  }
  getFormatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
  getFormatHours(date: string): string {
    if (date == '') { return date; }
    let stringDate = '';
    try {
      let d = new Date(date);
      if (d.getHours() < 10) { stringDate = `0${d.getHours()}H:`; } else { stringDate = `${d.getHours()}H:`; }

      if (d.getMinutes() < 10) { stringDate += `0${d.getMinutes()} Min`; } else { stringDate += `${d.getMinutes()} Min`; }
    } catch (err) {
      console.log(err);
    }

    return stringDate;
  }
  getBuyer(id: EntityID) {
    if (this.userService.listUser.has(id.toString())) { return this.userService.listUser.get(id.toString()).email; }
    return '';
  }
  // emptyMarket() {
  //   if (this.waitResponseBtn || this.waitResponseSecondBtn) { return; }
  //   this.waitResponseBtn = true;
  //   this.marketService.putAllNoToMarket()
  //   .then((result: ResultStatut) => {
  //     this.waitResponseBtn = false;
  //     this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The market was successfully emptied', 200);
  //   })
  //   .catch((error: ResultStatut) => {
  //     this.waitResponseBtn = false;
  //     // tslint:disable-next-line:max-line-length
  //     this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
  //   });
  // }

  checkInvestmentList() {
    if (this.waitResponseBtn || this.waitResponseSecondBtn) { return; }
    this.waitResponseSecondBtn = true;
    this.dataUpdateService.clearAndCheckDateBaseInvestment()
    .then((result: ResultStatut) => {
      this.waitResponseSecondBtn = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br> The market has been updated successfully `, 200);
    })
    .catch((error: ResultStatut) => {
      this.waitResponseSecondBtn = false;
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
    });
  }


}
