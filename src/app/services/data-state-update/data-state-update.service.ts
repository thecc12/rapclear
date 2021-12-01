import { Injectable } from '@angular/core';
import { Message } from '../../entity/chat';
import { EntityID } from '../../entity/EntityID';
import { Investment, InvestmentState } from '../../entity/investment';
import { User } from '../../entity/user';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { BasicInvestmentService } from '../investment/basic-investment.service';
import { UserNotificationService } from '../user-notification/user-notification.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class DataStateUpdateService {

  constructor(
    private firebaseApi: FirebaseApi,
    private eventService: EventService,
    private userNotification: UserNotificationService,
    private userService: UserService,
    private investmentService: BasicInvestmentService
  ) {
    // this.eventService.loginEvent.subscribe((user:User)=>{
    this.updateInvestmentMarket();
    this.updateAccountToBlocque();
    // this.updateInvestmentNotPaid();
    console.log("Test update")
    // })
    this.eventService.registerNewUserEvent.subscribe((user: User) => {
      if (!user) { return; }
      let date: Date = new Date();
      date.setDate(date.getDate() + 5);
      this.addMaxDateTo(`toupdate/account/${user.id.toString()}`, date);
    });

    this.eventService.addInvestmentEvent.subscribe((investment: Investment) => {
      if (!investment) { return; }
      let date: Date = new Date(investment.paymentDate);
      date.setDate(date.getDate() + investment.plan);
      this.addMaxDateTo(`toupdate/investment/market/${investment.id.toString()}`, date);
    });

    this.eventService.shouldPaidInvestmentEvent.subscribe((investment: Investment) => {
      if (!investment) { return; }
      let date: Date = new Date();
      date.setHours(date.getHours() + 5);
      this.addMaxDateTo(`toupdate/investment/waittopaid/${investment.id.toString()}`, date);
    });

    this.eventService.investmentPaidEvent.subscribe((investment: Investment) => {
      if (!investment) { return; }
      this.firebaseApi.delete(`toupdate/investment/waittopaid/${investment.id.toString()}`);
    });
  }

  // async updateInvestmentNotPaid() {
  //   this.findAndUpdate('toupdate/investment/waittopaid', (id: EntityID) => {

  //     this.deleteToUpdate(`toupdate/investment/waittopaid/${id.toString()}`);

  //     this.investmentService
  //     .getInvestmentById(id)
  //     .then((result: ResultStatut) => {
  //       this.userService.changeStatusUsingId(result.result.idBuyer);
  //       // console.log("findinvestment ",id);
  //       return this.userNotification.findMessageByInvestmentId(id, result.result.idOwner);
  //     })
  //     .then((result: ResultStatut) => {
  //       // console.log("Notif ",result)
  //       this.userNotification.deleteNotification(result.result);
  //     });
  //     this.firebaseApi.updates([
  //       {
  //         link: `investments/${id.toString()}/idBuyer`,
  //         data: ''
  //       },
  //       {
  //         link: `investments/${id.toString()}/buyState`,
  //         data: InvestmentState.ON_WAITING_BUYER
  //       },
  //       {
  //         link: `investments/${id.toString()}/state`,
  //         data: InvestmentState.ON_MARKET
  //       },
  //       {
  //         link: `investments/${id.toString()}/waintedGain`,
  //         data: {
  //           jour: 0,
  //           pourcent: 0
  //         }
  //       }
  //     ]);
  //   }, false);
  // }

  async updateInvestmentMarket() {
      this.findAndUpdate('toupdate/investment/market', (id: EntityID) => {
          this.deleteToUpdate(`toupdate/investment/market/${id.toString()}`);

          this.investmentService.changeInvestmentStatus(id);
      });
  }

  async updateAccountToBlocque() {
    this.findAndUpdate('toupdate/account', (id: EntityID) => {
      this.firebaseApi
        .getFirebaseDatabase()
        .ref('investments')
        .orderByChild('idOwner')
        .limitToLast(1)
        .equalTo(id.toString())
        .once('value', (dataInvestment) => {
          if (!dataInvestment.val()) {
            // console.log("Data ",dataInvestment)
            this.deleteToUpdate(`toupdate/account/${id.toString()}`);
            this.userService.changeStatusUsingId(id)
          } else { this.deleteToUpdate(`toupdate/account/${id.toString()}`); }
        });
      }, false);
  }

  clearAndCheckDateBaseInvestment(): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi
      .getFirebaseDatabase()
      .ref('investments')
      .orderByChild('investmentState')
      .equalTo(InvestmentState.ON_WAITING_PAYMENT_DATE)
      .once('value', (snapshot) => {
        let data = snapshot.val();
        let toupdate = {};
        // tslint:disable-next-line:forin
        console.log("Data ",data)
        for (let key in data) {
          let investment: Investment = new Investment();
          investment.hydrate(data[key]);
          // let now = new Date();
          // let after = new Date(investment.saleDate);
          // if (after >= now)
          toupdate[investment.id.toString().toString()] = {dateMax: investment.paymentDate};
        }
        console.log("toupdated ",toupdate)
        this.firebaseApi.set('toupdate/investment/market', toupdate)
        .then((result: ResultStatut) => resolve(result))
        .catch((error: ResultStatut) => {
          this.firebaseApi.handleApiError(error);
          reject(error);
        });
      });
    });
  }

  findAndUpdate(url: String, updateFnct: (key: EntityID) => void, day: boolean= true) {
    this.firebaseApi
      .getFirebaseDatabase()
      .ref(url)
      .once('value', (data) => {
        let kdata = data.val();
        // console.log("Data update",url,kdata)
        // tslint:disable-next-line:forin
        for (let key in kdata) {
          let now = new Date();
          let after = new Date(kdata[key].dateMax);
          // console.log("Now ",now,"after ",after, url);
          // if(day)
          // {
          //   now =  new Date((new Date()).toLocaleDateString());
          //   after =new Date(after.toLocaleDateString());
          // }
          let id: EntityID = new EntityID();
          id.setId(key);
          if (after <= now) {
            // console.log("Yes")
            // console.log("Data update",kdata)
            updateFnct(id);
          }
        }
      });
  }
  addMaxDateTo(url: string, dateMax: Date): Promise<ResultStatut> {
    return this.firebaseApi.set(url, { dateMax: dateMax.toISOString() });
  }

  deleteToUpdate(url: string): Promise<ResultStatut> {
    return this.firebaseApi.delete(url);
  }
}
