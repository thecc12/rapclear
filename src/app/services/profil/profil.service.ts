import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EntityID } from '../../entity/EntityID';
import { MIN_RETREIVAL_BONUS, Investment } from '../../entity/investment';
import { SponsorID } from '../../entity/sponsorid';
import { User } from '../../entity/user';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { InvestmentService } from '../investment/investment.service';
import { MarketService } from '../market/market.service';
import { MembershipService } from '../opperations/Membership.service';
import { UserHistoryService } from '../user-history/user-history.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  fieulList: {user: User, nberInvestment: Number}[] = [];
  investmentForBalanceAccount: Map<string, boolean> = new Map<string, boolean>();

  balancedAccount: number = 0;
  balancedAccountObservable: BehaviorSubject<number> = new BehaviorSubject<number>(this.balancedAccount);

  constructor(
    private marketService: MarketService,
    private eventService: EventService,
    private authService: AuthService,
    private firebaseApi: FirebaseApi,
    private userService: UserService,
    private memberShipService: MembershipService,
    private historyService: UserHistoryService,
    private investmentService: InvestmentService
  ) {
    // this.recombineHistory();
    // this.reCalculateBonus();

    this.eventService.loginEvent.subscribe((user: User) => {
      if (!user) { return; }
      this.balancedAccount += user.bonus;
      this.balancedAccountObservable.next(this.balancedAccount);
    });

    this.eventService
    .newInvestmentArrivedEvent
    .subscribe((arrived: boolean) => {
      if (!arrived) { return; }
      this.balancedAccount = this.authService.currentUserSubject.getValue().bonus;
    });

    this.marketService
    .getMyOrderedInvestment()
    .subscribe((investment: Investment) => {
      if (!this.investmentForBalanceAccount.has(investment.toString().toString())) {
        this.balancedAccount += investment.amount;
        this.investmentForBalanceAccount.set(investment.toString().toString(), true);
        this.balancedAccountObservable.next(this.balancedAccount);
      }
    });
   }
   retreiveBonus(amount) {
     return new Promise<ResultStatut>((resolve, reject) => {
      if (this.authService.currentUserSubject.getValue().bonus >= amount) {
        let user = this.authService.currentUserSubject.getValue();
        user.bonus -= amount;
        this.authService.setUserData(user);
        this.firebaseApi.updates([{
          link: `users/${user.id.toString()}/bonus`,
          data: user.bonus
        }])
        .then((result: ResultStatut) => resolve(result))
        .catch((error: ResultStatut) => reject(error));
      } else {
        let error: ResultStatut = new ResultStatut();
        error.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
        error.message = 'The bonus amount must be greater than 15000';
        reject(error);
      }
     });
   }
  //  reCalculateBonus() {
  //    console.log('Start recalculate bonus');
  //    this.firebaseApi.fetchOnce('users')
  //    .then((result: ResultStatut) => {
  //      let data = result.result;
  //      // tslint:disable-next-line:forin
  //      for (let idUser in data) {
  //        let userBonus: Number = 0;
  //         let user: User = new User();
  //         user.hydrate(data[idUser]);
  //         this.getFieulList(user.mySponsorShipId, false)
  //         // tslint:disable-next-line:no-shadowed-variable
  //         .then((rs: ResultStatut) => Promise.all(rs.result.map((user: User) => this.historyService.getUserInvestmentByIdBuyer(user.id))))
  //         .then((results) => {
  //           // console.log("Results ",results)
  //           userBonus = results
  //             .map((r: ResultStatut) => r.result.reduce((bonus, curr: Investment) => {
  //               // console.log(bonus,curr)
  //               return this.memberShipService.membership(curr.amount, bonus)
  //             }, 0))
  //             .reduce((bonus, currBonus) => bonus + currBonus, userBonus);
  //             // console.log("Firs bonus ",userBonus)
  //           return this.investmentService.getUserInvestmentByBuyerId(user.id)
  //         })
  //         // tslint:disable-next-line:no-shadowed-variable
  //         .then((result: ResultStatut) => {
  //           // tslint:disable-next-line:max-line-length
  //           userBonus = result.result.reduce((bonus, investment: Investment) => this.memberShipService.membership(investment.amount, bonus), userBonus)
  //           console.log('Email: ', user.email, 'Last Bonus ', user.bonus, ' New Bonus ', userBonus);
  //         })
  //         .catch((error: ResultStatut) => console.log('Error ', error)) //2272.8
  //      }
  //    })
  //  }

   recombineHistory() {
     let investmentList: Investment[] = [];
     this.firebaseApi
     .fetchOnce('investments')
     .then((result: ResultStatut) => {
       let data = result.result;
       // tslint:disable-next-line:forin
       for (let key in data) {
        let investment: Investment = new Investment();
        investment.hydrate(data[key]);
        investmentList.push(investment);
       }
       return this.historyService.getUsersWihtOutBuyerHistory();
     })
     .then((result: ResultStatut) => {
      let histories: Investment[] = result.result;
      histories = histories.concat(investmentList);
      this.historyService.makeUniqueCoupleHistory(this.historyService.makeEquivalenceClassInvestment(histories));
     })
     .catch((error: ResultStatut) => console.log(error));
   }

   addParentBonus(user: User, investmentAmount) {
    return new Promise<ResultStatut>((resolve, reject) => {
      if (user.parentSponsorShipId.toString() != '') {
        this.userService.getUserBySponsorId(user.parentSponsorShipId)
        .then((result: ResultStatut) => {
          result.result.bonus = this.memberShipService.membership(investmentAmount, result.result.bonus);

          return this.firebaseApi.updates([
                {
                    link: `users/${result.result.id.toString()}/bonus`,
                    data: result.result.bonus
                }
            ]);
        })
        .then((result: ResultStatut) => resolve(result))
        .catch((error: ResultStatut) => resolve(new ResultStatut));
      } else { resolve(new ResultStatut()); }
    });
   }

   // tslint:disable-next-line:max-line-length
   getFieulList(sponsorShipId: SponsorID= this.authService.currentUserSubject.getValue().mySponsorShipId, withUserInvestment= true): Promise<ResultStatut> {
     return new Promise<ResultStatut>((resolve, reject) => {
      let resultStatut: ResultStatut = new ResultStatut();
      // if(this.fieulList.length>0) {
      //   resultStatut.result = this.fieulList.slice();
      //   return resolve(resultStatut)
      // }
      this.fieulList = [];
      this.firebaseApi
      .getFirebaseDatabase()
      .ref('users')
      .orderByChild('parentSponsorShipId')
      .equalTo(sponsorShipId.toString())
      .once('value', (result) => {
        let data = result.val();
        let promiseList = [];
        let userList = [];
        // tslint:disable-next-line:forin
        for (let k in data) {
          let user: User = new User();
          user.hydrate(data[k]);
          user.dateCreation = (new Date(user.dateCreation)).toLocaleDateString();
          promiseList.push({user, promise: this.historyService.getUserInvestmentHistory(user.id)});
        }
        Promise.all(promiseList.map((pl) => pl.promise))
        .then((results: ResultStatut[]) => {
          // console.log("result ",results)
            for (let i = 0; i < results.length; i++) {
              if (withUserInvestment) {
                this.fieulList.push({
                  user: promiseList[i].user,
                  nberInvestment: this.marketService.getNumberOfInvestment(promiseList[i].user.id) + results[i].result.length
                });
              } else { userList.push(promiseList[i].user); }
            }

            if (withUserInvestment) { resultStatut.result = this.fieulList.slice(); }
            else { resultStatut.result = userList; }
          resolve(resultStatut);
        });
        // this.fieulList.push({user,nberInvestment:this.marketService.getNumberOfInvestment(user.id)});

      });
     });
   }

   reMakeHistory() {

   }
}
