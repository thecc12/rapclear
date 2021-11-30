import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../../entity/chat';
import { EntityID } from '../../entity/EntityID';
import { MIN_RETREIVAL_BONUS, Investment, InvestmentGain, InvestmentState } from '../../entity/investment';
import { User } from '../../entity/user';
import { AuthService } from '../auth/auth.service';
import { ConfigAppService } from '../config-app/config-app.service';
import { EventService } from '../event/event.service';
import { FireBaseConstant } from '../firebase/firebase-constant';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { MarketService } from '../market/market.service';
import { MembershipService } from '../opperations/Membership.service';
import { PlanService } from '../opperations/plan.service';
import { ProfilService } from '../profil/profil.service';
import { UserHistoryService } from '../user-history/user-history.service';
import { UserNotificationService } from '../user-notification/user-notification.service';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class BasicInvestmentService {
    investments: Map<String, Investment> = new Map<String, Investment>();
    investmentList: BehaviorSubject<Map<String, Investment>> = new BehaviorSubject<Map<String, Investment>>(this.investments);

    currentUser: User;

    constructor(private firebaseApi: FirebaseApi,
        private eventService: EventService,
        private authService: AuthService,
        private planService: PlanService,
        private userNotificationService: UserNotificationService,
        private userHistoryService: UserHistoryService,
        private memberShipService: MembershipService,
        private userService: UserService,
        private marketService: MarketService,
        private userProfil: ProfilService,
        private configAppService: ConfigAppService,
        private router: Router
        ) {
            this.eventService.loginEvent.subscribe((log) => {
              if (!log) { return; }
              this.newInvestmentHandler();
            });
        }

    changeInvestmentStatus(idInvestment: EntityID) {
        let nstatus = InvestmentState.READY_TO_PAY;
        return new Promise<ResultStatut>((resolve, reject) => {
        this.firebaseApi.updates([{
            link: `investments/${idInvestment.toString()}/investmentState`,
            data: nstatus
        }])
        .then((result) => {
            if (this.investmentList.getValue().has(idInvestment.toString())) {
                this.investmentList.getValue().get(idInvestment.toString()).investmentState = nstatus;
            }
            resolve(result);
        })
        .catch((error) => {
            this.firebaseApi.handleApiError(error);
            reject(error);
        });
        });
    }

    splitInvestment(investment: Investment, amount: number): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            if (amount >= investment.amount) {
                let result: ResultStatut = new ResultStatut();
                result.message = 'Cannot perform division. the amount is greater than or equal to the amount of the investment';
                result.code = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                return reject(result);
            }

            let newInvestment: Investment = new Investment();
            newInvestment.hydrate(investment.toString());
            newInvestment.id.setId(new EntityID().toString());

            newInvestment.amount = amount;
            investment.amount = investment.amount - amount;
            this.firebaseApi.updates([
                {
                    link: `investments/${investment.id.toString()}/amount`,
                    data: investment.amount
                },
                {
                    link: `investments/${newInvestment.id.toString()}`,
                    data: newInvestment.toString()
                }
            ])
            .then((result: ResultStatut) => resolve(result))
            .catch((error: ResultStatut) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            });
        });
    }

    newInvestmentHandler() {
        this.firebaseApi
        .getFirebaseDatabase()
        .ref('investments')
        .on('child_added', (snapshot) => {
            let investment: Investment = new Investment();
            investment.hydrate(snapshot.val());
            if (!this.investments.has(investment.id.toString())) {
                this.investments.set(investment.id.toString(), investment);
                this.investmentList.next(this.investments);
            }
        });
    }

    deleteInvestment(investment: Investment): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.delete(`investments/${investment.id}`)
            .then((result: ResultStatut) => resolve(result))
            .catch((error: ResultStatut) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            });
        });
    }

    changeStatusMarket(investment: Investment): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            // tslint:disable-next-line:max-line-length
            let nstatus = InvestmentState.INITIATE == investment.investmentState ? InvestmentState.ON_WAITING_PAYMENT_DATE : InvestmentState.INITIATE;
            // console.log("new status",nstatus,investment.state)
            this.firebaseApi.updates([{
                link: `investments/${investment.id.toString()}/investmentState`,
                data: nstatus
              }])
              .then((result) => {
                this.investmentList.getValue().get(investment.id.toString()).investmentState = nstatus;
                resolve(result);
              })
              .catch((error) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
              });
        });
    }

    getInvestmentById(idInvestment: EntityID): Promise<ResultStatut> {
        let result = new ResultStatut();
        return new Promise<ResultStatut>((resolve, reject) => {
            if (this.marketService.investments.getValue().has(idInvestment.toString())) {
                result.result = this.marketService.investments.getValue().get(idInvestment.toString());
                return resolve(result);
            }
            if (this.investmentList.getValue().has(idInvestment.toString())) {
                result.result = this.investmentList.getValue().get(idInvestment.toString());
                return resolve(result);
            }
            // tslint:disable-next-line:no-shadowed-variable
            this.getOnlineInvestment(idInvestment).then((result) => resolve(result)).catch((error) => reject(error));
        });
    }

    getOnlineInvestment(idInvestment: EntityID) {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.fetchOnce(`investments/${idInvestment.toString()}`)
            .then((result: ResultStatut) => {
                if (!result.result) {
                    // console.log("Dara pas ",result.result,idInvestment)
                    result.apiCode = FireBaseConstant.STORAGE_OBJECT_NOT_FOUND;
                    result.message = 'Data not found';
                    return reject(result);
                }
                let investment = new Investment();
                // console.log("Investment",result.result,idInvestment)
                investment.hydrate(result.result);
                this.investments.set(investment.id.toString(), investment);
                this.investmentList.next(this.investments);
                result.result = investment;
                resolve(result);
            })
            .catch((error: ResultStatut) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            });
        });
    }

    addInvestment(investment: Investment, user: User, isBonusInvestment= false): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.updates([
                {
                    link: `investments/${investment.id}`,
                    data: investment.toString()
                }
            ])
            .then((result: ResultStatut) => {
                this.eventService.addInvestmentEvent.next(investment);
                this.router.navigate(['/user/dashboard']);
                // tslint:disable-next-line:max-line-length
                if (isBonusInvestment) { return Promise.resolve(new ResultStatut()); } else { return this.userProfil.addParentBonus(user, investment.amount); }}
            )
            .then((result: ResultStatut) => resolve(result))
            .catch((error) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            });
        });
    }

    transfertBonusToInvestment() {
     return new Promise<ResultStatut>((resolve, reject) => {
       let user: User = this.authService.currentUserSubject.getValue();
       let result: ResultStatut = new ResultStatut();
       if (user.bonus < this.configAppService.bonus.getValue().minBonus) {
         result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
         result.message = '\<b>Oops!!\</b>The bonus amount must be greater than 15000';
         return reject(result);
       }
       let newInvestment = new Investment();
       newInvestment.investmentDate = new Date().toISOString();
       newInvestment.paymentDate = newInvestment.investmentDate;
       newInvestment.investmentState = InvestmentState.ON_WAITING_PAYMENT_DATE;
       newInvestment.amount = this.configAppService.bonus.getValue().minBonus;
       newInvestment.idOwner.setId(user.id.toString());
    //    console.log("bonus investment ",newInvestment)
       this.addInvestment(newInvestment, user, true)
       .then((result: ResultStatut) => this.userProfil.retreiveBonus(this.configAppService.bonus.getValue().minBonus))
       .then((result: ResultStatut) => resolve(result))
       .catch((error: ResultStatut) => {
           if (error.apiCode != ResultStatut.INVALID_ARGUMENT_ERROR) { this.firebaseApi.handleApiError(error); }
           reject(error);
       });
    });
   }

    // Etape 1
    // L'acheteur envoi la demande d'achat en faisant le depos
    // BuyAInvestment(p: Investment, gain: InvestmentGain): Promise<ResultStatut> {
    //     return new Promise<ResultStatut>((resolve, reject) => {
    //         this.getOnlineInvestment(p.id)
    //         .then((result: ResultStatut) => {
    //             let investment: Investment = result.result;
    //             if (investment.investmentState != InvestmentState.ON_WAITING_PAYMENT_DATE) {
    //                 let result: ResultStatut = new ResultStatut();
    //                 result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
    //                 result.message = 'Investment is not on market';
    //                 return reject(result);
    //             }
    //             // if (investment.buyState != InvestmentBuyState.ON_WAITING_BUYER) {// investment.idBuyer.toString().trim()!=""
    //             //     let result: ResultStatut = new ResultStatut();
    //             //     result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
    //             //     result.message = 'The investment do not wait for buyer\'s payment';
    //             //     return reject(result);
    //             // }
    //             investment.state = InvestmentState.NOT_ON_MARKET;
    //             investment.buyState = InvestmentBuyState.ON_WAITING_SELLER_CONFIRMATION_PAIEMENT;
    //             investment.idBuyer.setId(this.authService.currentUserSubject.getValue().id.toString());
    //             // console.log("PAck",this.authService.currentUserSubject.getValue().id.toString(), investment,investment.toString())
    //             let d: Date = new Date();
    //             d.setHours(d.getHours() + 5);
    //             investment.maxPayDate = d.toISOString();
    //             investment.wantedGain.hydrate(gain.toString());
    //             investment.nextAmount = this.planService.calculePlan(investment.amount, gain.jour);
    //             this.firebaseApi.updates([
    //                 {
    //                     link: `investments/${investment.id.toString()}/`,
    //                     data: investment.toString(),
    //                 },
    //             ])
    //             .then((result) => {
    //                 this.eventService.shouldPaidInvestmentEvent.next(investment);
    //                 let message: Message = new Message();
    //                 message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
    //                 message.to.setId(investment.idOwner.toString());
    //                 message.date = (new Date()).toISOString();
    //                 message.content = 'the payment of the investment has been made by the buyer. Please confirm';
    //                 message.idInvestment.setId(investment.id.toString());
    //                 message.id.setId(investment.id.toString());
    //                 return this.userNotificationService.sendNotification(message);
    //             })
    //             .then((result) => resolve(result))
    //             .catch((error) => {
    //                 this.firebaseApi.handleApiError(error);
    //                 reject(error);
    //             });
    //         });
    //     });
    // }

    // tslint:disable-next-line:max-line-length
    confirmInvestment(p: Investment, msg: Message, user: User= this.authService.currentUserSubject.getValue(), onLine: boolean= true): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.getOnlineInvestment(p.id)
            .then((result: ResultStatut) => {
                let investment: Investment = result.result;
                if (!onLine) { investment = p; }
                if (investment.investmentState == InvestmentState.ON_WAITING_PAYMENT_DATE) {
                    let result: ResultStatut = new ResultStatut();
                    result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                    result.message = 'Investment is already confirmed';
                    return reject(result);
                }
                // tslint:disable-next-line:triple-equals max-line-length
                if (investment.investmentState != InvestmentState.INITIATE) {// || investment.idBuyer.toString().trim()==""
                    let result: ResultStatut = new ResultStatut();
                    result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                    result.message = 'The investment is not awaiting confirmation';
                    return reject(result);
                }
                investment.investmentState = InvestmentState.ON_WAITING_PAYMENT_DATE;
                investment.paymentDate =  onLine == true ? (new Date()).toISOString() : investment.paymentDate;
                // investment.nextAmount=this.planService.calculePlan(investment.amount,investment.wantedGain.jour)

                let newInvestment: Investment = new Investment();
                newInvestment.id.setId(investment.id.toString());
                newInvestment.amount = investment.nextAmount;
                newInvestment.investmentDate = investment.paymentDate;

                let dateForSelle = new Date(newInvestment.investmentDate);
                // console.log("here date", investment.wantedGain,dateForSelle.getDate()+investment.wantedGain.jour)
                dateForSelle.setDate(dateForSelle.getDate() + investment.wantedGain.jour);
                newInvestment.paymentDate = dateForSelle.toISOString();
                newInvestment.investmentState = InvestmentState.ON_WAITING_PAYMENT_DATE;
                newInvestment.plan = investment.wantedGain.jour;
                newInvestment.wantedGain.init();
                // newInvestment.idOwner.setId(msg.from.toString());
                // newInvestment.idBuyer.setId(' ');

                this.firebaseApi.updates([
                    {
                        link: `investments/${investment.id.toString()}`,
                        data: newInvestment.toString()
                    }
                ])
                .then((result) => this.userHistoryService.addToHistory(investment, user.id))
                .then((result) => {
                    this.eventService.investmentPaidEvent.next(newInvestment);
                    this.eventService.addInvestmentEvent.next(newInvestment);
                    return this.userNotificationService.deleteNotification(msg);
                })
                .then((result) => this.userService.getUserById(msg.from, true))
                .then((result) => this.userProfil.addParentBonus(result.result, newInvestment.amount))
                .then((result) => resolve(result))
                .catch((error) => {
                    this.firebaseApi.handleApiError(error);
                    reject(error);
                });
            });
        });
    }

}
