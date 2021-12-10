import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { Message } from '../../entity/chat';
import { EntityID } from '../../entity/EntityID';
import {  Request,  RequestState } from '../../entity/request';
import { User } from '../../entity/user';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../event/event.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { FireBaseConstant } from '../firebase/firebase-constant';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { NotificationService } from '../notification/notification.service';
import { UserNotificationService } from '../user-notification/user-notification.service';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BasicRequestService {
    requests: Map<String, Request> = new Map<String, Request>();
    requestList: BehaviorSubject<Map<String, Request>> = new BehaviorSubject<Map<String, Request>>(this.requests);

    currentUser: User;

    constructor(private firebaseApi: FirebaseApi,
        private db: AngularFireDatabase,
        private eventService: EventService,
        private authService: AuthService,
        private userNotificationService: UserNotificationService,
        private userService: UserService,
        private notification: NotificationService,
        private router: Router
        ) {
            // this.eventService.loginEvent.subscribe((log) => {
            //   if (!log) { return; }
              
            // });
            this.authService.currentUserSubject.subscribe((user)=>{
                if(!user) return;
                if(this.authService.isAdminer) this.newRequestAdminHandler();
                else this.newRequestUserHandler(user.id);
            })
        }


          remouveRequest(key) {
            return this.db.object('/requests/' + key).remove();
          }

        saveRequest (product) {
            return this.db.list('/requests').push(product);
          }

        getRequest()
        {
            return this.requestList.pipe(
                switchMap((p) => from(Array.from(p.values()))),
              );
        }

        getUserRequest(idOwner: EntityID=this.authService.currentUserSubject.getValue().id) {
            return this.getRequest().pipe(
                filter((r:Request) => r.idOwner.toString() == idOwner.toString())
            );
        }
        getUserRequestByState(idOwner: EntityID=this.authService.currentUserSubject.getValue().id,requestState:RequestState)
        {
            return this.getUserRequest(idOwner).pipe(
                filter((request:Request)=> request.requestState==requestState)
            )
        }
        getAllUserRequestByState(requestState:RequestState)
        {
            return this.getRequest().pipe(
                filter((request:Request)=> request.requestState==requestState)
            )
        }


        approuveRequestStatus(request: Request):Promise<ResultStatut> {
            let nstatus = RequestState.VALIDED;
            return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.updates([{
                link: `requests/${request.idOwner.toString()}/${request.id.toString()}/requestState`,
                data: nstatus
            }])
            .then((result) => {
                if (this.requestList.getValue().has(request.id.toString())) {
                    this.requestList.getValue().get(request.id.toString()).requestState = nstatus;
                    request.requestState=nstatus;
                }
                resolve(result);
            })
            .catch((error) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            });
            });
        }
        rejectRequestStatus(request: Request):Promise<ResultStatut> {
            let nstatus = RequestState.REJECTED;
            return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.updates([{
                link: `requests/${request.idOwner.toString()}/${request.id.toString()}/requestState`,
                data: nstatus
            }])
            .then((result) => {
                if (this.requestList.getValue().has(request.id.toString())) {
                    this.requestList.getValue().get(request.id.toString()).requestState = nstatus;
                    request.requestState=nstatus;

                }
                resolve(result);
            })
            .catch((error) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            });
            });
        }


    newRequestUserHandler(userID:EntityID)
    {
        this.firebaseApi
        .getFirebaseDatabase()
        .ref(`requests/${userID.toString()}`)
        .once('value', (result) => {
          this.requests.clear();
          let data = result.val();
          for(let reqID in data)
          {
            let request: Request = new Request();
            request.hydrate(data[reqID]);
            if (!this.requests.has(request.id.toString())) {
                this.requests.set(request.id.toString(), request);
            }
          }
          this.requestList.next(this.requests);    
          this.eventService.newRequestArrivedEvent.next(true);     
      })

    }

    newRequestAdminHandler() {
        this.firebaseApi
        .getFirebaseDatabase()
        .ref('requests')
        .on('value', (snapshot) => {
            let data=snapshot.val();
            console.log("value on ",data)
            for(let user in data)
            {
                for(let userId in data[user])
                {
                    let request: Request = new Request();
                    request.hydrate(data[user][userId]);
                    if (!this.requests.has(request.id.toString())) {
                        this.requests.set(request.id.toString(), request);
                    }
                }
                
            }
            this.requestList.next(this.requests);         
            this.eventService.newRequestArrivedEvent.next(true);   
        });
    }

    deleteRequest(request: Request): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            this.firebaseApi.delete(`requests/${request.id}`)
            .then((result: ResultStatut) => resolve(result))
            .catch((error: ResultStatut) => {
                this.firebaseApi.handleApiError(error);
                reject(error);
            });
        });
    }
    getNextStatust(requestStatus:RequestState):RequestState
    {
        // if(requestStatus==RequestState.INITIATE) return RequestState.ON_WAITING_PAYMENT_DATE;
        // if(requestStatus==RequestState.ON_WAITING_PAYMENT_DATE) return RequestState.READY_TO_PAY;
        // if(requestStatus==RequestState.READY_TO_PAY) return RequestState.PAYED;
        // if(requestStatus==RequestState.PAYED) return RequestState.ARCHIVED;
        return RequestState.INITIATE;

    }

    addRequest(request: Request): Promise<ResultStatut> {
        return new Promise<ResultStatut>((resolve, reject) => {
            let requestDate = new Date();
            request.requestDate = requestDate.toISOString();
            request.requestState = RequestState.INITIATE;
            // console.log('contene de la requete: ', request.toString());
            this.firebaseApi.updates([
                {
                    link: `requests/${request.idOwner}/${request.id}`,
                    data: request.toString()
                }
            ])
            .then((result: ResultStatut) => {
                this.router.navigate(['/user/dashboard']);
                this.notification.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Send !\</b>\<br>Your request has been sent. \<br>Please allow a maximum of 24 hours for processing.`);
            })
            .catch((error) => {
                this.firebaseApi.handleApiError(error);
                this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', `\<b>Error !\</b>\<br>A problem has occurred, please try again`);
                reject(error);
            });
        });
    }

    // tslint:disable-next-line:max-line-length
    // confirmRequest(p: Request, msg: Message, user: User= this.authService.currentUserSubject.getValue(), onLine: boolean= true): Promise<ResultStatut> {
    //     return new Promise<ResultStatut>((resolve, reject) => {
    //         this.getOnlineRequest(p.id)
    //         .then((result: ResultStatut) => {
    //             let request: Request = result.result;
    //             if (!onLine) { request = p; }
    //             if (request.requestState == RequestState.ON_WAITING_PAYMENT_DATE) {
    //                 let result: ResultStatut = new ResultStatut();
    //                 result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
    //                 result.message = 'Request is already confirmed';
    //                 return reject(result);
    //             }
    //             // tslint:disable-next-line:triple-equals max-line-length
    //             if (request.requestState != RequestState.INITIATE) {// || request.idBuyer.toString().trim()==""
    //                 let result: ResultStatut = new ResultStatut();
    //                 result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
    //                 result.message = 'The request is not awaiting confirmation';
    //                 return reject(result);
    //             }
    //             request.requestState = RequestState.ON_WAITING_PAYMENT_DATE;
    //             request.paymentDate =  onLine == true ? (new Date()).toISOString() : request.paymentDate;
    //             // request.nextAmount=this.planService.calculePlan(request.amount,request.wantedGain.jour)

    //             let newRequest: Request = new Request();
    //             newRequest.id.setId(request.id.toString());
    //             newRequest.amount = request.nextAmount;
    //             newRequest.requestDate = request.paymentDate;

    //             let dateForSelle = new Date(newRequest.requestDate);
    //             // console.log("here date", request.wantedGain,dateForSelle.getDate()+request.wantedGain.jour)
    //             dateForSelle.setDate(dateForSelle.getDate() + request.wantedGain.jour);
    //             newRequest.paymentDate = dateForSelle.toISOString();
    //             newRequest.requestState = RequestState.ON_WAITING_PAYMENT_DATE;
    //             newRequest.plan = request.wantedGain.jour;
    //             newRequest.wantedGain.init();
    //             // newRequest.idOwner.setId(msg.from.toString());
    //             // newRequest.idBuyer.setId(' ');

    //             this.firebaseApi.updates([
    //                 {
    //                     link: `requests/${request.id.toString()}`,
    //                     data: newRequest.toString()
    //                 }
    //             ])
    //             .then((result) => this.userHistoryService.addToHistory(request, user.id))
    //             .then((result) => {
    //                 this.eventService.requestPaidEvent.next(newRequest);
    //                 this.eventService.addRequestEvent.next(newRequest);
    //                 return this.userNotificationService.deleteNotification(msg);
    //             })
    //             .then((result) => this.userService.getUserById(msg.from, true))
    //             .then((result) => this.userProfil.addParentBonus(result.result, newRequest.amount))
    //             .then((result) => resolve(result))
    //             .catch((error) => {
    //                 this.firebaseApi.handleApiError(error);
    //                 reject(error);
    //             });
    //         });
    //     });
    // }

}
