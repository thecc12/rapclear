import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserAccountState } from '../../entity/user';
import { ResultStatut } from '../firebase/resultstatut';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { EntityID } from '../../entity/EntityID';
import { EventService } from '../event/event.service';
import { FireBaseConstant } from '../firebase/firebase-constant';
import { SponsorID } from '../../entity/sponsorid';
// import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  listUser: Map<String, User> = new Map<string, User>();
  usersSubject: BehaviorSubject<Map<String, User>> = new BehaviorSubject<Map<String, User>>(this.listUser);



  constructor(
    private firebaseApi: FirebaseApi,
    private eventService: EventService
  ) {

    this.eventService.loginEvent.subscribe((user: User) => {
      this.newUserHandler();
    });
  }

  newUserHandler(): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.getFirebaseDatabase()
        .ref('users')
        .on('child_added', (snapshot) => {
          let user: User = new User();
          user.hydrate(snapshot.val());
          if (!this.listUser.has(user.id.toString())) {
            this.listUser.set(user.id.toString(), user);
            this.usersSubject.next(this.listUser);
          }
        });
    });
  }

  getListUser(): User[] {
    let r: User[] = [];
    this.listUser.forEach((value: User) => r.push(value));
// console.log('les user service ' + this.listUser);
    return r;
  }

  setUser(user: User) {
    if (!this.listUser.has(user.id.toString())) { this.listUser.set(user.id.toString(), user) }
  }

  // recuperer les informations d'un utilisateur
  getUserById(id: EntityID, getOnline: boolean = false): Promise<ResultStatut> {
    // console.log("id ",id)
    return new Promise<any>((resolve, reject) => {
      // if (getOnline == false && this.listUser.has(id.toString())) {
      //   result.result = this.listUser.get(id.toString());
      //   return resolve(result);
      // }
      if(this.listUser.has(id.toString()))
      {
        let result: ResultStatut = new ResultStatut();

        let user:User=this.listUser.get(id.toString())
        result.result=user;
        return resolve(result);
      }
      this.firebaseApi.fetchOnce(`users/${id.toString()}`)
        .then((result: ResultStatut) => {
          let user: User = new User();
          if (result.result == null || result.result == undefined) {
            result.message = 'User not found';
            result.apiCode = ResultStatut.INVALID_ARGUMENT_ERROR;
            return reject(result);
          }
          user.hydrate(result.result);
          this.listUser.set(user.id.toString(), user);
          this.usersSubject.next(this.listUser);
          result.result = user;

          resolve(result);
        })
        .catch((error) => {
          this.firebaseApi.handleApiError(error);
          reject(error);
        });
    });
  }



  getUserBySponsorId(sponsorID: SponsorID): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      let user:User=Array.from(this.listUser.values()).find((user:User)=>user.mySponsorShipId.toString()==sponsorID.toString());
      if(user)
      {
        this.listUser.set(user.id.toString(),user);
        let result=new ResultStatut();
        result.result=user;
        return resolve(result);
      }
      this.firebaseApi
        .getFirebaseDatabase()
        .ref('users')
        .orderByChild('mySponsorShipId')
        .equalTo(sponsorID.toString())
        .once('value', (data) => {
          let result: ResultStatut = new ResultStatut();
      // console.log("find by bonus ",data.val())
          if (!data.val()) {
            result.apiCode = FireBaseConstant.STORAGE_OBJECT_NOT_FOUND;
            result.message = 'user not found';
            return reject(result);
          }
          // tslint:disable-next-line:forin
          for (let okey in data.val()) {
            let user: User = new User();
            user.hydrate(data.val()[okey]);
            result.result = user;
            this.listUser.set(user.id.toString(),user);
            return resolve(result);
          }
        });
    });
  }

  addUser(user: User): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      console.log('add user fonction: ', user.toString());
      if (this.listUser.has(user.id.toString())) { return resolve(new ResultStatut()); }
      // console.log("User ",user.toString())
      this.firebaseApi.set(`users/${user.id.toString()}`, user.toString())
        .then((result) => {
          this.listUser.set(user.id.toString(), user);
          this.usersSubject.next(this.listUser);
          resolve(new ResultStatut());
        }).catch((error) => {
          this.firebaseApi.handleApiError(error);
          reject(error);
        });
    });
  }

  changeStatusUsingId(idUser: EntityID): Promise<ResultStatut> {
    return this.getUserById(idUser)
      .then((result: ResultStatut) => this.changeStatus(result.result))
  }

  changeStatus(user: User): Promise<ResultStatut> {
    let nstatus = UserAccountState.ACTIVE == user.status ? UserAccountState.DESACTIVE : UserAccountState.ACTIVE;
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.updates([{
        link: `users/${user.id.toString()}/status`,
        data: nstatus
      }])
        .then((result) => {
          this.usersSubject.getValue().get(user.id.toString()).status = nstatus;
          resolve(result);
        })
        .catch((error) => {
          this.firebaseApi.handleApiError(error);
          reject(error);
        });
    });
  }

  updateUser(user: User): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      this.firebaseApi.updates([{
        link: `users/${user.id.toString()}`,
        data: user.toString()
      }])
        .then((result: ResultStatut) => resolve(result))
        .catch((error: ResultStatut) => {
          this.firebaseApi.handleApiError(error);
          reject(error);
        });
    });
  }

}
