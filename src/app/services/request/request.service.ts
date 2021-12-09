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
export class RequestService {
    // requests: Map<String, Investment> = new Map<String, Investment>();
    // requestList: BehaviorSubject<Map<String, Investment>> = new BehaviorSubject<Map<String, Investment>>(this.investments)

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
        
    }

    // getAllRequest()
    // {
    //     this.firebaseApi.fetchOnce("requests")
    //     .then((result:ResultStatut)=>{
    //         if(!result) return;
            
    //     })
    // }
    

}
