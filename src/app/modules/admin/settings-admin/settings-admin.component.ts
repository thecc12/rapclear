import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Market, MarketOpenTime } from '../../../entity/market';
import { ConfigAppService } from '../../../services/config-app/config-app.service';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { NotificationService } from '../../../services/notification/notification.service';
import { AdminTimerpickerComponent } from '../admin-timerpicker/admin-timerpicker.component';

@Component({
  selector: 'app-settings-admin',
  templateUrl: './settings-admin.component.html',
  styleUrls: ['./settings-admin.component.css']
})
export class SettingsAdminComponent implements OnInit, AfterViewInit {
  market: Market = new Market();
  waitForChangeStateMarket: boolean = false;
  waitForChangeStateMarketTwo: boolean = false;
  waitLoadData: boolean = true;

  timeList: MarketOpenTime[] = [];

  @ViewChildren(AdminTimerpickerComponent) timePickers: QueryList<AdminTimerpickerComponent>;


  constructor(private configAppService: ConfigAppService,
    private notificationService: NotificationService) {

  }

  ngOnInit(): void {
    this.configAppService.market.subscribe((market: Market) => {
      this.market = market;
      // console.log("market ",market)
      this.timeList = market.openTime.slice();
      if (market.openTime.length > 0) { this.waitLoadData = false; }
    })
  }
  ngAfterViewInit(): void {
    // this.timePicker.
  }
  addTimeRange()
  {
    this.timeList.push(new MarketOpenTime())
  }
  removeTimeRange()
  {
    this.timeList.splice(this.timeList.length - 1)
  }
  saveTimeRange()
  {
    let tlist: AdminTimerpickerComponent[] = this.timePickers.toArray();
    for (let i = 0; i < tlist.length; i += 2)
    {
      let date1 = new Date();
      // tslint:disable-next-line:radix
      date1.setHours(parseInt(tlist[i].getHours()));
      // tslint:disable-next-line:radix
      date1.setMinutes(parseInt(tlist[i].getMinutes()));

      let date2 = new Date();
      // tslint:disable-next-line:radix
      date2.setHours(parseInt(tlist[i + 1].getHours()));
      date2.setMinutes(parseInt(tlist[i + 1].getMinutes()));
      if (date2 <= date1)
      {
        this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>The time range N°${(i / 2) + 1} is not valid`);
        return;
      }
      this.timeList[i / 2].start = tlist[i].getTime();
      this.timeList[i / 2].end = tlist[i + 1].getTime();
    }
    // console.log("Time range ",this.timeList)
    if (this.waitForChangeStateMarket || this.waitForChangeStateMarketTwo) { return; }
    this.market.openTime = this.timeList.slice();
    this.waitForChangeStateMarketTwo = true;
    this.configAppService.saveMarket(this.market)
    .then((result: ResultStatut) => {
      this.waitForChangeStateMarketTwo = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>the market opening times have been successfully saved`);
    })
    .catch((result: ResultStatut) => {
      this.waitForChangeStateMarketTwo = false;
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>` + result.message);
    })
  }

  changeMarketStatus()
  {
    this.waitForChangeStateMarket = true;
    this.configAppService.switchMarketState()
    .then((result: ResultStatut) => {
      this.waitForChangeStateMarket = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The status of the market has been changed successfully ');
    })
    .catch((error) => {
      this.waitForChangeStateMarket = false;
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);
    })
  }


}
