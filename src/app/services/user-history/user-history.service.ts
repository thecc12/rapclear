import { Injectable } from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';
import { EntityID } from '../../entity/EntityID';
import { Investment, InvestmentState } from '../../entity/investment';
import { User } from '../../entity/user';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { MarketService } from '../market/market.service';
import { PlanService } from '../opperations/plan.service';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {

  historyList: Investment[] = [];
  history: BehaviorSubject<Investment[]> = new BehaviorSubject<Investment[]>(this.historyList);
  currentUser: User;

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private firebaseApi: FirebaseApi,
    private planService: PlanService,
    private marketService:MarketService
    ) {
      this.authService.currentUserSubject.subscribe((user: User) => {
        this.currentUser = user;
        this.getInvestmentsHistoryFromApi(this.authService.currentUserSubject.getValue());
      });
      // this.eventService.loginEvent.subscribe((user:User)=>{
      //    if(!user) return;
      // })
      this.eventService.logoutEvent.subscribe((logout: boolean) => {
        if (!logout) { return; }
        this.historyList = [];
        this.history.next(this.historyList);
      });
    }
    getUserInvestmentByIdBuyer(idBuyer: EntityID) {
      console.log('idBuer ', idBuyer.toString());
      return new Promise<ResultStatut>((resolve, reject) => {
        this.firebaseApi.fetchOnce('history')
          .then((result) => {
            // console.log("jlqsdjqqfsd")
            let rd = result.result;
            let rs: ResultStatut = new ResultStatut();
            rs.result = [];
            // tslint:disable-next-line:forin
            for (let idUser in rd) {
              // tslint:disable-next-line:forin
              for (let idInvestment in rd[idUser]) {
                let investment: Investment = new Investment();
                investment.hydrate(rd[idUser][idInvestment]);
                // tslint:disable-next-line:triple-equals
              }
            }
            console.log('Result buyer ', rs.result);
            resolve(rs);
          })
          .catch((error: ResultStatut) => reject(error));
      });
    }
    getUserInvestmentHistory(idUser: EntityID) {
      return new Promise<ResultStatut>((resolve, reject) => {
        this.firebaseApi.fetchOnce(`history/${idUser.toString()}`)
        .then((result: ResultStatut) => {
          // console.log("History ",result.result)
          let historyList = [];
          // tslint:disable-next-line:forin
          for (let key in result.result) {
            let investment = new Investment();
            investment.hydrate(result.result[key]);
            historyList.push(investment);
          }
          result.result = historyList;
          resolve(result);
        })
        .catch((error) => reject(error));
      });
    }
    getInvestmentsHistoryFromApi(user: User) {
      //console.log(user)
      this.historyList=[];
      this.history.next(this.historyList);
        merge(
          this.marketService.getMyOrderedInvestmentByState(user.id,InvestmentState.PAYED),
          this.marketService.getMyOrderedInvestmentByState(user.id,InvestmentState.REFUSE),
          this.marketService.getMyOrderedInvestmentByState(user.id,InvestmentState.INITIATE),
          this.marketService.getMyOrderedInvestmentByState(user.id,InvestmentState.ON_WAITING_PAYMENT_DATE),
          this.marketService.getMyOrderedInvestmentByState(user.id,InvestmentState.READY_TO_PAY)
        )
         .subscribe((investment: Investment) => {
              this.historyList.push(investment);
              this.history.next(this.historyList)
        });
        
    }
    findInvestment(investmentId: EntityID): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
          let investment = this.historyList.find((p: Investment) => p.id.toString() == investmentId.toString());
          if (investment) {
              let result: ResultStatut = new ResultStatut();
              result.result = investment;
              return resolve(result);
          }
          this.firebaseApi.fetchOnce(`history/${this.currentUser.id.toString()}/${investmentId.toString()}`)
          .then((result) => {
              let investment = new Investment();
              investment.hydrate(result.result);
              result.result = investment;
              this.historyList.push(investment);
              resolve(result);
          })
          .catch((error) => {
              this.firebaseApi.handleApiError(error);
              reject(error);
          });
        });
    }
    addToHistory(investment: Investment, userID: EntityID= this.currentUser.id): Promise<ResultStatut> {
      // console.log("Addhistor =y ", investment);
      return new Promise<ResultStatut>((resolve, reject) => {
        this.firebaseApi.set(`history/${userID.toString()}/${investment.id.toString()}/`, investment.toString())
        .then((result: ResultStatut) => {
          this.historyList.push(investment);
          this.history.next(this.historyList);
          resolve(result);
        })
        .catch((error) => {
          this.firebaseApi.handleApiError(error);
          reject(error);
        });
      });
    }

  getUserInvestmentSingleHistory(idUser: EntityID, idInvestment: EntityID): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.fetchOnce(`history/${idUser.toString()}/${idInvestment.toString()}`)
      .then((result: ResultStatut) => {
        let investment: Investment = new Investment();
        investment.hydrate(result.result);
        result.result = investment;
        resolve(result);
      })
      .catch((error: ResultStatut) => reject(error));
      });
  }



  updateHistoryBuyer(link: {first: Investment, second: Investment}): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      // if (link.first.idBuyer.toString().trim() == '') {
      //   console.log('link ', link);
      //   this.firebaseApi
      //   .updates([
      //     {
      //       link: `history/${link.first.idOwner.toString()}/${link.first.id.toString()}/idBuyer`,
      //       data: link.second.idOwner.toString()
      //     }
      //   ])
      //   .then((result: ResultStatut) => resolve(result))
      //   .catch((error: ResultStatut) => {
      //     console.log('Error ', error);
      //     this.firebaseApi.handleApiError(error);
      //     reject(error);
      //   });
      //   // resolve(new ResultStatut())
      // }
    });
  }

  makeUniqueCoupleHistory(classEquiInvestment: Map<string, {first: Investment, second: Investment}[]>): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      let historySequence: {first: Investment, second: Investment}[] = [];
      let historyMap: Map<String, boolean> = new Map<String, boolean>();
      for (const seq of Array.from(classEquiInvestment.values())) {
        seq.forEach((couple) => {
          if (!historyMap.has(`${couple.first.id.toString()}${couple.second.id.toString()}`)) {
            historyMap.set(`${couple.first.id.toString()}${couple.second.id.toString()}`, true);
            historySequence.push(couple);
          }
        });
      }
      // console.log("historySequence ",historySequence)
      Promise.all(historySequence.map((couple: {first: Investment, second: Investment}) => this.updateHistoryBuyer(couple)))
      .then((result: ResultStatut[]) => resolve(new ResultStatut()))
      .catch((error: ResultStatut) => reject(error));
    });
  }

  makeEquivalenceClassInvestment(histories: Investment[]): Map<string, {first: Investment, second: Investment}[]> {
    // tslint:disable-next-line:max-line-length
    let classEquiInvestment: Map<string, {first: Investment, second: Investment}[]> = new Map<string, {first: Investment, second: Investment}[]>();
    // console.log("Historie equi ",histories)
    let md: Map<string, boolean> = new Map<string, boolean>();

    for (let i = 0; i < histories.length; i++) {
      for (let j = i + 1; j < histories.length; j++) {
        let investmentDatei = new Date(histories[i].investmentDate).toLocaleDateString();
        let paymentDatei = new Date(histories[i].paymentDate).toLocaleDateString();
        let investmentDatej = new Date(histories[j].paymentDate).toLocaleDateString();
        let paymentDatej = new Date(histories[j].investmentDate).toLocaleDateString();
        // if(paymentDatej==investmentDatei && histories[j].plan==histories[i].plan)  console.log(histories[i], histories[j])
        if (
          paymentDatej == investmentDatei && 
          histories[i].idOwner.toString() != histories[j].idOwner.toString() &&
          (histories[j].plan == histories[i].plan || histories[j].wantedGain.jour == histories[i].plan) && 
          (histories[i].amount == histories[j].nextAmount )
        )
        {
        //   if (histories[j].idBuyer.toString().trim() == '')
        //  {
        //   if (classEquiInvestment.has(paymentDatej) ) classEquiInvestment.get(paymentDatej).push({first: histories[j], second: histories[i]});
        //   else classEquiInvestment.set(paymentDatej, [{first: histories[j], second: histories[i]}]);
        //  }
        } else if (
          paymentDatei == investmentDatej && 
          histories[i].idOwner.toString() != histories[j].idOwner.toString() &&
          (histories[j].plan == histories[i].plan || histories[i].wantedGain.jour == histories[j].plan) &&
            histories[j].amount == histories[i].nextAmount
        ) 
        {
        //   if (histories[i].idBuyer.toString().trim() == '') {
        //   if (classEquiInvestment.has(paymentDatei)) classEquiInvestment.get(paymentDatei).push({first: histories[i], second: histories[j]});
        //   else classEquiInvestment.set(paymentDatei, [{first: histories[i], second: histories[j]}]);
        //  }
        }
      }
    }
    return classEquiInvestment;
  }

  getUsersWihtOutBuyerHistory(): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.fetchOnce('history')
      .then((result: ResultStatut) => {
        let histories : Investment[] = [];
        let data = result.result;
        // tslint:disable-next-line:forin
        for (let idUser in data) {
          // tslint:disable-next-line:forin
          for (let idInvestment in data[idUser]) {
            let investment: Investment = new Investment();
            investment.hydrate(data[idUser][idInvestment]);
            // if(investment.idBuyer.toString().trim()=="")
             histories.push(investment);
          }
        }
        // console.log("historique ",histories)
        result.result = histories;
        resolve(result);
      })
      .catch((error: ResultStatut) => reject(error));
    });
  }

}
