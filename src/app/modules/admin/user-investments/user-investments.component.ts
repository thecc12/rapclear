import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { EntityID } from '../../../entity/EntityID';
import { Investment } from '../../../entity/investment';
import { User } from '../../../entity/user';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { MarketService } from '../../../services/market/market.service';
import { UserHistoryService } from '../../../services/user-history/user-history.service';
import { UserService } from '../../../services/user/user.service';
import { UserAddInvestmentComponent } from '../user-add-investment/user-add-investments.component';
import { UserTransferInvestmentComponent } from '../user-transfer-investment/user-transfer-investment.component';

@Component({
  selector: 'app-user-investments',
  templateUrl: './user-investments.component.html',
  styleUrls: ['./user-investments.component.css']
})
export class UserInvestmentsComponent implements OnInit, OnChanges {
  @Input() user: User = null;
  userObservable: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  listPurchasedInvestment: Investment[] = [];
  listPurchasedInvestmentCheck: Map<string, boolean> = new Map<string, boolean>();

  listSaleInvestment: Investment[] = [];
  listSaleInvestmentCheck: Map<string, boolean> = new Map<string, boolean>();

  listHistoryInvestment: Investment[] = [];
  listHistoryInvestmentCheck: Map<string, boolean> = new Map<string, boolean>();
  constructor(private marketService: MarketService,
    private historyService: UserHistoryService,
    private userService: UserService,
    public dialog: BsModalService) { }
  
  ngOnInit(): void {
    this.userObservable.subscribe((user: User) => {
      if (!user) { return; }
      this.listPurchasedInvestment = new Array(),
      this.listPurchasedInvestmentCheck.clear();
      this.marketService.getUserOrderdInvestmentNotInMarket(user.id).forEach((investment: Investment) => {
        if (!this.listPurchasedInvestmentCheck.has(investment.id.toString().toString())) {
          this.listPurchasedInvestmentCheck.set(investment.id.toString().toString(), true);
          this.listPurchasedInvestment.push(investment);
        }
      })

      this.listSaleInvestment = new Array(),
      this.listSaleInvestmentCheck.clear();
      this.marketService.getUserOrderedInvestmentOnMarket(user.id).forEach((investment: Investment) => {
        if (!this.listSaleInvestmentCheck.has(investment.id.toString().toString())) {
          this.listSaleInvestmentCheck.set(investment.id.toString().toString(), true);
          this.listSaleInvestment.push(investment);
        }
      });

      this.listHistoryInvestment = new Array(),
      this.historyService.getUserInvestmentHistory(user.id)
      .then((result: ResultStatut) => this.listHistoryInvestment = result.result)
    })
  }
  getFormatDate(date: string): string
  {
    return new Date(date).toLocaleDateString()
  }
  getFormatHours(date: string): string
  {
    if (date == '') { return date; }
    let stringDate = "";
    try
    {
      let d = new Date(date)
      if (d.getHours() < 10) { stringDate = `0${d.getHours()}H:`; }
      else { stringDate = `${d.getHours()}H:`; }

      if (d.getMinutes() < 10) stringDate += `0${d.getMinutes()} Min`;
      else stringDate += `${d.getMinutes()} Min`;
    }
    catch (err)
    {
      console.log(err)
    }
    
    return stringDate;
  }
  getBuyer(id: EntityID)
  {
    if (this.userService.listUser.has(id.toString())) {
      return this.userService.listUser.get(id.toString()).email; }
    return '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user && changes.user.currentValue != null)
    {
      this.userObservable.next(this.user);
    }
  }
  tranferInvestment(investment: Investment)
  {
    this.dialog.show(UserTransferInvestmentComponent,
      {
        initialState: {
          user: this.user,
          investment
        }
      }
      )
  }
  openDialog()
  {
    const dialogRef = this.dialog.show(UserAddInvestmentComponent, {
      initialState: {
        user: this.user
      }
    });
  }

}
