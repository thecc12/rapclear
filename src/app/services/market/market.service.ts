import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { filter, map, reduce, scan, switchMap } from 'rxjs/operators';
import { EntityID } from '../../entity/EntityID';
import { Investment, InvestmentState } from '../../entity/investment';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  listInvestment: Map<String, Investment> = new Map<String, Investment>();
  investments: BehaviorSubject<Map<String, Investment>> = new BehaviorSubject<Map<String, Investment>>(this.listInvestment);
  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private firebaseApi: FirebaseApi,
    private router: Router) {
      // this.putAllNoToMarket();
    // this.eventService.loginEvent.subscribe((user) => {
    //   if (!user) return;
      //cette requete ne doit ce faire que si le marché est ouvert
      this.firebaseApi.getFirebaseDatabase()
        .ref('investments')
        .on('value', (snapshot) => this.newInvestmentFromMarket(snapshot));

        this.firebaseApi.getFirebaseDatabase()
          .ref('investments')
          .on('child_changed', (snapshot) => this.updateInvestmentFromMarket(snapshot));

      // this.getMyOrderedInvestmentOnMarket().subscribe((investment)=>console.log("Data in market ",investment))
    // });
  }

  refuseAllInvestment() {
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.getFirebaseDatabase()
        .ref('investments')
        .once('value', (investments) => {
          let investmentListTack: Promise<ResultStatut>[] = [];
          let oplist = investments.val();
          // tslint:disable-next-line:forin
          for (let ikey in oplist) {
            let ivm: Investment = new Investment();
            ivm.hydrate(oplist[ikey]);
            ivm.investmentState = InvestmentState.REFUSE;
            investmentListTack.push(this.firebaseApi.updates([{
              link: `investments/${ivm.id.toString()}/investmentState`,
              data: InvestmentState.REFUSE
            }]));
          }
          Promise.all(investmentListTack)
          .then((result) => resolve(new ResultStatut()))
          .catch((error: ResultStatut) => reject(error));
        });
    });
  }

  getNumberOfInvestment(idUser: EntityID): Number {
    let nbinvestment = 0;
    for (let investment of Array.from(this.listInvestment.values())) {
      console.log(investment.idOwner.toString(), idUser.toString());
      // tslint:disable-next-line:triple-equals
      if (investment.idOwner.toString() == idUser.toString()) { nbinvestment++; }
    }
    return nbinvestment;
  }

  getOrderMarket() {
    return this.investments.pipe(
      switchMap((p) => from(Array.from(p.values()))),
    );
  }

  getMyOrderedInvestmentByState(idOwner: EntityID = this.authService.currentUserSubject.getValue().id,state:InvestmentState) {
    return this.getOrderMarket().pipe(
      filter((p: Investment) =>  {
        return p.idOwner.toString() == idOwner.toString() && p.investmentState==state;
      }),
    );
  }
  getMyOrderedInvestment(idOwner: EntityID = this.authService.currentUserSubject.getValue().id) {
    return this.getOrderMarket().pipe(
      filter((p: Investment) =>  {
        return p.idOwner.toString() == idOwner.toString();
      }),
    );
  }
  getUserOrderedInvestment(idOwner: EntityID) {
    return this.getMyOrderedInvestment(idOwner);
  }

  getAllPayedInvestment() {
    return this.getOrderMarket().pipe(
      filter((p: Investment) => p.investmentState == InvestmentState.PAYED),
    );
  }

  getAllRejectedInvestment() {
    return this.getOrderMarket().pipe(
      filter((p: Investment) => p.investmentState == InvestmentState.REFUSE),
    );
  }

  getAllReadyToPayInvestment() {
    return this.getOrderMarket().pipe(
      filter((p: Investment) => p.investmentState == InvestmentState.READY_TO_PAY),
    );
  }
  getAllWaitingPaymentDateInvestment() {
    return this.getOrderMarket().pipe(
      filter((p: Investment) => p.investmentState == InvestmentState.ON_WAITING_PAYMENT_DATE),
    );
  }
  getAllInitiatedInvestment() {
    return this.getOrderMarket().pipe(
      filter((p: Investment) => p.investmentState == InvestmentState.INITIATE),
    );
  }
  getOtherOrderedInitiatedInvestment() {
    return this.getAllInitiatedInvestment().pipe(
      filter((p: Investment) => p.idOwner.toString() != this.authService.currentUserSubject.getValue().id.toString())
    );
  }

  getMyOrderedInitiatedInvestment(idOwner: EntityID) {
    return this.getAllInitiatedInvestment().pipe(
      filter((p: Investment) => p.idOwner.toString() == idOwner.toString()),
    );
  }

  getUserOrderedInitiatedInvestment(idOwner: EntityID) {
    return this.getMyOrderedInitiatedInvestment(idOwner);
  }

  getMyOrderedWaitingPaymentDateInvestment(idOwner: EntityID) {
    return this.getAllWaitingPaymentDateInvestment().pipe(
      filter((p: Investment) => p.idOwner.toString() == idOwner.toString()),
    );
  }

  getUserOrderedWaitingPaymentDateInvestment(idOwner: EntityID) {
    return this.getMyOrderedWaitingPaymentDateInvestment(idOwner);
  }

  getMyOrderedReadyToPayInvestment(idOwner: EntityID) {
    return this.getAllReadyToPayInvestment().pipe(
      filter((p: Investment) => p.idOwner.toString() == idOwner.toString()),
    );
  }

  getUserOrderedReadyToPayInvestment(idOwner: EntityID) {
    return this.getMyOrderedReadyToPayInvestment(idOwner);
  }

  getMyOrderedPayedInvestment(idOwner: EntityID) {
    return this.getAllPayedInvestment().pipe(
      filter((p: Investment) => p.idOwner.toString() == idOwner.toString()),
    );
  }

  getUserOrderedPayedInvestment(idOwner: EntityID) {
    return this.getMyOrderedPayedInvestment(idOwner);
  }

  getMyOrderedRejectedInvestment(idOwner: EntityID) {
    return this.getAllRejectedInvestment().pipe(
      filter((p: Investment) => p.idOwner.toString() == idOwner.toString()),
    );
  }

  getUserOrderedRejectedInvestment(idOwner: EntityID) {
    return this.getMyOrderedRejectedInvestment(idOwner);
  }
  // getAllInvestmentNotInMarket() {
  //   return this.getOrderMarket().pipe(
  //     filter((p: Investment) => p.investmentState == InvestmentState.ON_WAITING_PAYMENT_DATE)
  //   );
  // }
  getMyOrderdPayedInvestment(idOwner: EntityID) {
    return this.getOrderMarket().pipe(
      filter((p: Investment) => p.idOwner.toString() == idOwner.toString()),
      filter((p: Investment) => p.investmentState == InvestmentState.ON_WAITING_PAYMENT_DATE)
    );
  }
  // getUserOrderdInvestmentNotInMarket(idOwner: EntityID) {
  //   return this.getMyOrderdInvestmentNotInMarket(idOwner);
  // }

  updateInvestmentFromMarket(investments: any) {
    let investment: Investment = new Investment();
    investment.hydrate(investments.val());
    if (this.listInvestment.has(investment.id.toString())) { this.listInvestment.delete(investment.id.toString()); }
    this.listInvestment.set(investment.id.toString(), investment);
    this.eventService.newInvestmentArrivedEvent.next(true);
    this.investments.next(this.listInvestment);
    this.eventService.syncFamilyEvent.next(true);
  }

  newInvestmentFromMarket(investments: any) {
    let investmentList: Investment[] = [];
    let oplist = investments.val();
    // tslint:disable-next-line:forin
    for (let ikey in oplist) {
      let ivm: Investment = new Investment();
      ivm.hydrate(oplist[ikey]);
      investmentList.push(ivm);
    }
    
    investmentList.sort((a: Investment, b: Investment) => a.amount > b.amount ? 0 : 1);

    investmentList.forEach((investment: Investment) => {
      if (this.listInvestment.has(investment.id.toString())) { return; }
      this.listInvestment.set(investment.id.toString(), investment);
    });
    this.eventService.newInvestmentArrivedEvent.next(true);
    this.investments.next(this.listInvestment);
    // console.log("list investment ",this.listInvestment)
    this.eventService.syncFamilyEvent.next(true);
  }

  getInvestmentList() {
    return from(Array.from(this.investments.getValue().values()));
  }


}
