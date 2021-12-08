import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Investment, InvestmentState } from '../../../entity/investment';
import { DataStateUpdateService } from '../../../services/data-state-update/data-state-update.service';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { BasicInvestmentService } from '../../../services/investment/basic-investment.service';
import { MarketService } from '../../../services/market/market.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';
import { SplitAdminInvestmentComponent } from '../split-admin-investment/split-admin-investment.investment';
import { UserTransferInvestmentComponent } from '../user-transfer-investment/user-transfer-investment.component';

@Component({
  selector: 'app-investments-admin-action',
  templateUrl: './investments-admin-action.component.html',
  styleUrls: ['./investments-admin-action.component.css']
})
export class InvestmentsAdminActionComponent implements OnInit, OnChanges {
  @Input() investment: Investment = new Investment();
  selectedInvestmentId: String = '';

  waitResponse: boolean = false;
  waitResponseSecond: boolean = false;
  waitResponseThird: boolean = false;
  waitResponseFour: boolean = false;

  constructor(
    private basicInvestmentService: BasicInvestmentService,
    private marketService: MarketService,
    private userService: UserService,
    private notificationService: NotificationService,
    private dataUpdateService: DataStateUpdateService,
    private dialog: BsModalService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("changes ", changes)
  }

  ngOnInit(): void {

  }

  refuseInvestment(investment: Investment) {
    if (this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) { return; }
    this.waitResponse = true;
    this.selectedInvestmentId = investment.id.toString();
    console.log(investment);
    this.basicInvestmentService.changeStatusMarket(investment, InvestmentState.REFUSE)
    .then((result: ResultStatut) => {
      this.waitResponse = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The status of the investment is now \<b>Rejected\</b>`, 200);
      this.selectedInvestmentId = '';
    })
    .catch((error: ResultStatut) => {
      this.waitResponse = false;
      this.selectedInvestmentId = '';
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
    });
  }

  confirmInvestment(investment: Investment) {
    if (this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) { return; }
    this.waitResponse = true;
    this.selectedInvestmentId = investment.id.toString();
    console.log(investment);
    this.basicInvestmentService.changeStatusMarket(investment, this.basicInvestmentService.getNextStatust(investment.investmentState))
    .then((result: ResultStatut) => {
      this.waitResponse = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The status of the investment is now \<b>On Waiting Payment Date\</b>`, 200);
      this.selectedInvestmentId = '';
    })
    .catch((error: ResultStatut) => {
      this.waitResponse = false;
      this.selectedInvestmentId = '';
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
    });
  }

  payInvestment(investment: Investment) {
    if (this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) { return; }
    this.waitResponse = true;
    this.selectedInvestmentId = investment.id.toString();
    console.log(investment);
    this.basicInvestmentService.changeStatusMarket(investment, this.basicInvestmentService.getNextStatust(investment.investmentState))
    .then((result: ResultStatut) => {
      this.waitResponse = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The status of the investment is now \<b>Payed\</b>`, 200);
      this.selectedInvestmentId = '';
    })
    .catch((error: ResultStatut) => {
      this.waitResponse = false;
      this.selectedInvestmentId = '';
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
    });
  }

  readyToPayInvestment(investment: Investment) {
    if (this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) { return; }
    this.waitResponse = true;
    this.selectedInvestmentId = investment.id.toString();
    console.log(investment);
    this.basicInvestmentService.changeStatusMarket(investment, this.basicInvestmentService.getNextStatust(investment.investmentState))
    .then((result: ResultStatut) => {
      this.waitResponse = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The status of the investment is now \<b>Ready to Pay\</b>`, 200);
      this.selectedInvestmentId = '';
    })
    .catch((error: ResultStatut) => {
      this.waitResponse = false;
      this.selectedInvestmentId = '';
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
    });
  }

  deleteInvestment(investment: Investment) {
    if (this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) { return; }
    this.waitResponseSecond = true;
    this.selectedInvestmentId = investment.id.toString();
    this.basicInvestmentService.deleteInvestment(investment)
    .then((result: ResultStatut) => {
      this.selectedInvestmentId = '';
      this.waitResponseSecond = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br> The investment has been deleted successfully `, 200);
    })
    .catch((error: ResultStatut) => {
      this.waitResponseSecond = false;
      this.selectedInvestmentId = '';
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
    });
  }

  // changeStatusInvestment(investment: Investment) {
  //   if (this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) { return; }
  //   this.waitResponse = true;
  //   this.selectedInvestmentId = investment.id.toString();
  //   console.log(investment);
  //   this.basicInvestmentService.changeStatusMarket(investment)
  //   .then((result: ResultStatut) => {
  //     this.waitResponse = false;
  //     this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The status of the investment is now '${investment.investmentState}'`, 200);
  //     this.selectedInvestmentId = '';
  //   })
  //   .catch((error: ResultStatut) => {
  //     this.waitResponse = false;
  //     this.selectedInvestmentId = '';
  //     // tslint:disable-next-line:max-line-length
  //     this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
  //   });
  // }
}
