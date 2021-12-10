import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User, UserAccountState } from '../../entity/user';
import { EventService } from '../event/event.service';
import { FireBaseConstant } from '../firebase/firebase-constant';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';
import { UserLocalStorageData, UserlocalstorageService } from '../localstorage/userlocalstorage.service';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User = new User();
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isAdminer: boolean = false;
  userManage: boolean = false;
  currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.currentUser);


  constructor(
    private firebaseApi: FirebaseApi,
    private localStorageService: UserlocalstorageService,
    private eventService: EventService,
    private userService: UserService,
    private router: Router,
    private notification: NotificationService) {
    this.localStorageService.dataUser.subscribe((userData: UserLocalStorageData) => {
      // console.log("userData ",userData)
      this.isLoggedIn.next(userData.isLoggedIn);
      this.currentUser = userData.user;
      this.ifAdminer(this.currentUser.email);
      this.ifUserManage(this.currentUser.email);
      this.emitUserData();
    });
  }

  setUserData(user: User) {
    if(!user){ return}
    this.localStorageService.setUserData({
      user,
      isLoggedIn: true
    });
  }

  emitUserData() {
    this.currentUserSubject.next(this.currentUser);
  }
  signIn(userN: User, emitEvent: boolean = true): Promise<ResultStatut> {
    let action = new ResultStatut();
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.signInApi(userN.email, userN.password)
        .then(result => {
          // userN.password="";
          this.setLocaStorageDatas();
          //userN.fullName = result.result.user.name;
          userN.email = result.result.user.email;
          userN.photoUrl = result.result.user.photoUrl || '';
          userN.id.setId(result.result.user.uid);

          this.ifAdminer(userN.email);
          this.ifUserManage(userN.email);
          if (emitEvent) {
            return this.userService.getUserById(userN.id);
          }
          return Promise.resolve(action);
        })
        .then((result) => {
          if (emitEvent) {
            if (result.result.status == UserAccountState.DESACTIVE) {
              result.apiCode = FireBaseConstant.DESACTIVED_ACCOUNT;
              result.result = {};
              this.firebaseApi.handleApiError(result);
              return reject(result);
            }
            this.eventService.loginEvent.next(result.result);
          }
          resolve(action);
          this.localStorageService.setUserData({
            isLoggedIn: true,
            user: result.result
          });
        })
        .catch(result => {
          this.firebaseApi.handleApiError(result);
          reject(result);
        });
    });
  }

  signOut(): void {
    this.firebaseApi.signOutApi();
    this.localStorageService.clearData();
    localStorage.clear();
    this.eventService.logoutEvent.next(true);
    this.router.navigate(['/login']);
    this.notification.showNotification('top', 'center', 'success', '', '\<b>You are logged out !\</b>', 2000);
    // this.currentUserSubject.n
  }

  saveNewUser(user:User):Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.createUserApi(user.email, user.password)
        .then(() => this.signIn(user, false))
        .then(() => {
          // console.log('add user: ', user);
          // this.SendVerificationMail();
          user.dateCreation = (new Date()).toISOString();
          this.eventService.registerNewUserEvent.next(user);
          return this.userService.addUser(user);
        })
        .then(() => {
          this.signOut();
          resolve(new ResultStatut());
        })
        .catch(e => {
          this.firebaseApi.handleApiError(e);
          reject(e);
        });
    });
  }
  signInNewUser(user: User):Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      // console.log('1 in service: ', user);
      if (user.parentSponsorShipId.toString().length>0) {
        console.log("avant get sponsort");
        this.userService.getUserBySponsorId(user.parentSponsorShipId)
        .then((result:ResultStatut)=> {
          console.log("get sponsort",result.result);
          let u:User=result.result;
          user.grandParentSponsorShipId.setId(u.parentSponsorShipId.toString());
          user.bigGrandParentSponsorShipId.setId(u.grandParentSponsorShipId.toString());
          return this.saveNewUser(user);
        })
        .then((result:ResultStatut)=>resolve(result))
        .catch((error)=>
        {console.log("get sponsort", error);reject(error)});
      } else {
        this.saveNewUser(user)
        .then((result:ResultStatut)=>resolve(result))
        .catch((error)=>reject(error));
      }
    });
  }

  // Send email verification when new user sign up
  SendVerificationMail() {
    return this.firebaseApi.user.sendEmailVerification();
  }

  // Send reset password email
  SendResetPassword(email) {
    return this.firebaseApi.auth().sendPasswordResetEmail(email);
  }

  ifAdminer(email: string) {
    if (email == 'admin@admin.com') {
      this.isAdminer = true;
      this.userManage = true;
    }
  }
  ifUserManage(email: string) {
    if (email == 'pundayusufu619@gmail.com') {
      this.userManage = true;
    }
  }
  setLocaStorageDatas() {
      this.currentUserSubject.subscribe((user: User) => {
        localStorage.setItem('name', user.fullName);
        localStorage.setItem('email', user.email);
        localStorage.setItem('emailVerified', user.emailVerified.toString());
        localStorage.setItem('phone', user.phone);
        localStorage.setItem('country', this.currentUserSubject.getValue().country);
        localStorage.setItem('city', this.currentUserSubject.getValue().city);
        localStorage.setItem('mySponsorShipId', user.mySponsorShipId.toString().toString());
        localStorage.setItem('parentSponsorShipId', this.currentUserSubject.getValue().parentSponsorShipId.toString().toString());
        localStorage.setItem('dateCreation', user.dateCreation);
        localStorage.setItem('status', user.status);
        localStorage.setItem('network', user.network);
        localStorage.setItem('bonus', user.bonus.toString());
      });
  }
}
