import { Injectable } from '@angular/core';
import { EventService } from '../event/event.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ResultStatut } from '../firebase/resultstatut';
import { User } from '../../entity/user';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { AuthService } from '../auth/auth.service';
import { Message } from '../../entity/chat';
import { UserNotificationService } from '../user-notification/user-notification.service';
import { EntityID } from '../../entity/EntityID';
import { UserHistoryService } from '../user-history/user-history.service';
import { map } from 'rxjs/operators';
import { Investment, InvestmentState } from '../../entity/investment';
import { ProfilService } from '../profil/profil.service';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class InvestmentService {
    investments: Map<String, Investment> = new Map<String, Investment>();
    investmentList: BehaviorSubject<Map<String, Investment>> = new BehaviorSubject<Map<String, Investment>>(this.investments)

    investmentCollection: AngularFirestoreCollection;
    currentUser: User;

    constructor(
        private firestore: AngularFirestore,
        private firebaseApi: FirebaseApi,
        private authService: AuthService,
        private userNotificationService: UserNotificationService,
        private userHistoryService: UserHistoryService,
        private userService:UserService,
        private router: Router,
        private afs: AngularFirestore,
        private userProfile:ProfilService,
        private eventService: EventService) {
        this.investmentCollection = afs.collection('investments');
        this.authService.currentUserSubject.subscribe((user: User) => {
            this.currentUser = user;
        });
    }

    addInvestment(investment: Investment): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.updates([
                {
                    link: `users/${this.authService.currentUserSubject.getValue().id}/investments/${investment.id}`,
                    data: true
                },
                {
                    link: `investments/${investment.id}`,
                    data: investment.toString()
                }
            ])
                .then((result: ResultStatut) => resolve(result))
                .catch((error) => {
                    this.firebaseApi.handleApiError(error);
                    reject(error);
                });
        });
    }

    deleteInvestment(investmentId: EntityID): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.delete(`users/${this.authService.currentUserSubject.getValue().id.toString()}/investments/${investmentId.toString()}`)
                .then((result: ResultStatut) => {
                    this.investments.delete(investmentId.toString());
                    resolve(result);
                });
                this.firebaseApi.delete(`investments/${investmentId.toString()}`);
        });
    }

    // AskForBuyInvestment(investment: Investment): Promise<ResultStatut> {
    //     return new Promise<ResultStatut>((resolve, reject) => {
    //         if (investment.investmentState != InvestmentState.ACTIVE) {
    //             let result: ResultStatut = new ResultStatut();
    //             result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
    //             result.message = 'Investment is not active';
    //             reject(result);
    //         }
    //         investment.investmentState = InvestmentBuyState.ON_WAITING_PAYMENT;
    //         this.firebaseApi.updates([
    //             {
    //                 link: `investments/${investment.id.toString()}/buyState`,
    //                 data: investment.investmentState
    //             }
    //         ])
    //             .then((result) => {
    //                 let message: Message = new Message();
    //                 message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
    //                 message.to.setId(investment.idOwner.toString())
    //                 message.date = (new Date()).toISOString();
    //                 message.content = 'A user requests the purchase of this investment. please confirm the sale';
    //                 message.idInvestment = investment.id;
    //                 return this.userNotificationService.sendNotification(message)
    //             })
    //             .then((result) => resolve(result))
    //             .catch((error) => {
    //                 this.firebaseApi.handleApiError(error);
    //                 reject(error);
    //             })
    //     })
    // }

    confirmInvestment(investment: Investment): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            if (investment.investmentState == InvestmentState.REFUSE) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'The investment has been rejected';
                reject(result);
            }
            if (investment.investmentState != InvestmentState.INITIATE) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'The payment is not in the initial state';
                reject(result);
            }

            investment.investmentState = InvestmentState.ON_WAITING_PAYMENT_DATE;
            this.firebaseApi.updates([
                {
                    link: `investments/${investment.id.toString()}/investmentState`,
                    data: investment.investmentState,
                },
                // {
                //     link: `investments/${investment.id.toString()}/idOwner`,
                //     data: this.authService.currentUserSubject.getValue().id.toString(),
                // },
            ])
                // .then((result) => {
                //     let message: Message = new Message();
                //     message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
                //     message.to.setId(investment.idOwner.toString());
                //     message.date = (new Date()).toISOString();
                //     message.content = 'the payment has been made';
                //     message.idInvestment = investment.id;
                //     return this.userNotificationService.sendNotification(message);
                // })
                .then((result)=>this.userService.getUserById(investment.idOwner))
                .then((result)=> this.userProfile.addParentBonus(result.result,investment.amount))
                .then((result) => resolve(result))
                .catch((error) => {
                    this.firebaseApi.handleApiError(error);
                    reject(error);
                });

        });
    }

    refuseInvestment(investment: Investment): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            if (investment.investmentState == InvestmentState.ON_WAITING_PAYMENT_DATE) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'The investment is already on wait payment state status.';
                reject(result);
            }
            if (investment.investmentState != InvestmentState.INITIATE) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'The payment is not in the initial state';
                reject(result);
            }

            investment.investmentState = InvestmentState.REFUSE;
            this.firebaseApi.updates([
                {
                    link: `investments/${investment.id.toString()}/investmentState`,
                    data: investment.investmentState,
                },
                // {
                //     link: `investments/${investment.id.toString()}/idOwner`,
                //     data: this.authService.currentUserSubject.getValue().id.toString(),
                // },
            ])
                // .then((result) => {
                //     let message: Message = new Message();
                //     message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
                //     message.to.setId(investment.idOwner.toString());
                //     message.date = (new Date()).toISOString();
                //     message.content = 'the payment has been made';
                //     message.idInvestment = investment.id;
                //     return this.userNotificationService.sendNotification(message);
                // })
                .then((result) => resolve(result))
                .catch((error) => {
                    this.firebaseApi.handleApiError(error);
                    reject(error);
                });

        });
    }

    ConfirmPayment(investment: Investment): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            if (investment.investmentState != InvestmentState.ON_WAITING_PAYMENT_DATE) {
                let result: ResultStatut = new ResultStatut();
                result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
                result.message = 'The payment is not on waiting payment state';
                reject(result);
            }
            investment.investmentState = InvestmentState.PAYED;
            this.firebaseApi.updates([
                {
                    link: `investments/${investment.id.toString()}/investmentState`,
                    data: investment.investmentState
                },
                // {
                //     link: `investments/${investment.id.toString()}/idBuyer`,
                //     data: investment.idBuyer.toString()
                // }
            ])
                .then((result) => {
                    let message: Message = new Message();
                    message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
                    // message.to.setId(idBuyer.toString());
                    message.date = (new Date()).toISOString();
                    message.content = 'The sale request has been accepted. made the payment';
                    message.idInvestment = investment.id;
                    return this.userNotificationService.sendNotification(message);
                })
                .then((result) => resolve(result))
                .catch((error) => {
                    this.firebaseApi.handleApiError(error);
                    reject(error);
                });
        });
    }

    // confirmPaiementBySeller(investment: Investment, idBuyer: EntityID): Promise<ResultStatut> {
        // return new Promise<ResultStatut>((resolve, reject) => {
        //     if (investment.state == InvestmentState.ON_MARKET) {
        //         let result: ResultStatut = new ResultStatut();
        //         result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
        //         result.message = 'Investment is already on market';
        //         reject(result);
        //     }
        //     if (investment.buyState != InvestmentBuyState.ON_WAITING_SELLER_CONFIRMATION_PAIEMENT) {
        //         let result: ResultStatut = new ResultStatut();
        //         result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
        //         result.message = 'The investment is not awaiting confirmation by the seller';
        //         reject(result);
        //     }

        //     investment.buyState = InvestmentBuyState.ON_END_SEL;
        //     this.firebaseApi.updates([
        //         {
        //             link: `investments/${investment.id.toString()}/buyState`,
        //             data: investment.buyState
        //         },

        //     ])
        //         .then((result) => this.userHistoryService.addToHistory(investment))
        //         .then((result) => {
        //             let newInvestment: Investment = new Investment();
        //             newInvestment.buyState = InvestmentBuyState.ON_WAITING_BUYER;
        //             newInvestment.state = InvestmentState.NOT_ON_MARKET;
        //             // tslint:disable-next-line:no-unused-expression
        //             newInvestment.idOwner;


        //             this.firebaseApi.updates([

        //             ]);
        //         })
        //         .then((result) => {
        //             let message: Message = new Message();
        //             message.from.setId(this.authService.currentUserSubject.getValue().id.toString());
        //             message.to.setId(investment.idBuyer.toString())
        //             message.date = (new Date()).toISOString();
        //             message.content = 'the payment of the investment has been made by the buyer';
        //             message.idInvestment = investment.id;
        //             return this.userNotificationService.sendNotification(message)
        //         })
        //         .then((result) => resolve(result))
        //         .catch((error) => {
        //             this.firebaseApi.handleApiError(error);
        //             reject(error);
        //         });

        // });
    // }


    ///////////////////////////////////
    /////////////////////////////
    //////////////////////////
    /////// ******** Juste pour eviter le probléme de dépendance cicylcle profil.service.ts -> basic-investment.service.ts *****/
    getUserInvestmentByOwnerId(idOwner: EntityID): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.getFirebaseDatabase()
                .ref('investments')
                .orderByChild('idOwner')
                .equalTo(idOwner.toString())
                .once('value', (result) => {
                    let rs: ResultStatut = new ResultStatut();
                    rs.result = [];
                    let data = result.val();
                    // tslint:disable-next-line:forin
                    for (let idInvestment in data) {
                        let investment: Investment = new Investment();
                        investment.hydrate(data[idInvestment]);
                        rs.result.push(investment);
                    }
                    resolve(rs);
                });
        });
    }

}
