import { Injectable, isDevMode } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { ResultStatut } from './resultstatut';
import { FireBaseConstant } from './firebase-constant';
import { EventService } from '../event/event.service';
import { Bug } from '../../entity/bug';

@Injectable({
  providedIn: 'root'
})
export class FirebaseApi {

  static firebaseConfig: any = {};
  debug: boolean = false;
  offlineMode: boolean = false;
  db: any;

  constructor(private eventService: EventService) {

    if (isDevMode()) {
      console.log('Dev Mode');
      FirebaseApi.firebaseConfig = {
        /////// dev database access

        apiKey: 'AIzaSyBLtDVukFiJKIqiRJm1BddR8XEvUYnhjA8',
        authDomain: 'tcc-invest.firebaseapp.com',
        databaseURL: 'https://tcc-invest-default-rtdb.firebaseio.com',
        projectId: 'tcc-invest',
        storageBucket: 'tcc-invest.appspot.com',
        messagingSenderId: '652829444071',
        appId: '1:652829444071:web:3aef21819d4ff5bd921f42',
        measurementId: 'G-WNC9YPMBZ1'
      };
    } else {
      console.log('Prod Mode');
      FirebaseApi.firebaseConfig = {
        /////// real database acces

        apiKey: 'AIzaSyBLtDVukFiJKIqiRJm1BddR8XEvUYnhjA8',
        authDomain: 'tcc-invest.firebaseapp.com',
        databaseURL: 'https://tcc-invest-default-rtdb.firebaseio.com',
        projectId: 'tcc-invest',
        storageBucket: 'tcc-invest.appspot.com',
        messagingSenderId: '652829444071',
        appId: '1:652829444071:web:3aef21819d4ff5bd921f42',
        measurementId: 'G-WNC9YPMBZ1'
      };
    }

    // Initialize Firebase
    firebase.initializeApp(FirebaseApi.firebaseConfig);
    // firebase.analytics();
    this.db = firebase.database();
    this.setDebugMode();
    this.setModeApp();
  }
  setDebugMode() {
    // if(this.debug) firebase.firestore.setLogLevel('debug');

  }
  setModeApp() {
    // if(this.offlineMode) firebase.firestore().enablePersistence();
  }
  getFirebaseDatabase() {
    return this.db;
  }

  add(url: string, value: any): Promise<ResultStatut> {
    let action = new ResultStatut();
    return new Promise((resolve, reject) => {
      this.db.ref(url).push().set(value).then((doc) => {
        action.description = 'successful add new collection';
        resolve(action);
      }).catch((err) => {
        // Bugsnag.notify(err)
        action.apiCode = err.code;
        action.code = ResultStatut.UNKNOW_ERROR;
        action.message = 'error';
        action.description = '' + err;
        reject(action);
      });
    });
  }

  set(url: string, value: any): Promise<ResultStatut> {
    let action = new ResultStatut();
    return new Promise<ResultStatut>((resolve, reject) => {
      this.db.ref(url).set(value).then(() => {
        action.message = 'success';
        action.description = 'successful set new collection';
        resolve(action);
      }).catch((err) => {
        // Bugsnag.notify(err)
        action.apiCode = err.code;
        action.code = ResultStatut.UNKNOW_ERROR;
        action.message = 'error';
        action.description = '' + err;
        reject(action);
      });
    });
  }

  fetchOnce(url: string): Promise<ResultStatut> {
    let action = new ResultStatut();
    return new Promise((resolve, reject) => {
      this.db.ref(url).once('value')
        .then((doc) => {
          try {
            action.result = doc.val();
            action.description = 'Successful fetching information';
            resolve(action);
          }
          catch (err) {
            // Bugsnag.notify(err)
            action.apiCode = err.code;
            action.code = ResultStatut.UNKNOW_ERROR;
            action.message = 'error';
            action.description = `${err}`;
            reject(action);
          }
        });
    });
  }


  fetch(url: string): Promise<ResultStatut> {
    let action = new ResultStatut();
    return new Promise<ResultStatut>((resolve, reject) => {
      this.db.ref(url).on('value', (doc) => {
        try {
          // let r=[];
          // doc.forEach(element => {
          //   r.push(element.val());
          // });
          action.description = 'Successful fetching information';
          action.result = doc.val();
          resolve(action);
        }
        catch (err) {
          // Bugsnag.notify(err)
          action.apiCode = err.code;
          action.code = ResultStatut.UNKNOW_ERROR;
          action.message = 'error';
          action.description = `${err}`;
          reject(action);
        }
      });
    });
  }

  updates(updates: { link: String, data: any }[]): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      let up = {};
      let result = new ResultStatut();
      updates.forEach((update) => up[update.link.toString()] = update.data);
      this.db.ref().update(up, (error) => {
        if (error) {
          // Bugsnag.notify(error)
          result.apiCode = error.error;
          result.message = error.message;
          return reject(result);
        }
        resolve(result);
      })
    });

  }

  delete(url: string): Promise<ResultStatut> {
    let action = new ResultStatut();
    return new Promise<ResultStatut>((resolve, reject) => {
      try {
        this.db.ref(url).remove();
        action.description = 'Successful deleting information';
        resolve(action);
      }
      catch (err) {
        // Bugsnag.notify(err)
        action.apiCode = err.code;
        action.code = ResultStatut.UNKNOW_ERROR;
        action.message = 'error';
        action.description = `${err}`;
        reject(action);
      }
    });

  }

  get user() {
    return firebase.auth().currentUser;
  }

  auth() {
    return firebase.auth();
  }

  signInApi(email: string, password: string): Promise<ResultStatut> {
    let result: ResultStatut = new ResultStatut();
    return new Promise(async (resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          result.description = 'Authentification successful';
          result.result = userCredential;
          // console.log("Credential ",userCredential.user)
          resolve(result);
        })
        .catch((error) => {
          // Bugsnag.notify(error)
          console.log('Error ', error)
          result.code = ResultStatut.UNKNOW_ERROR;
          result.apiCode = error.code;
          result.message = 'error';
          result.description = `${error}`;
          reject(result);
        });
    });
  }

  signOutApi() {
    firebase.auth().signOut();
  }

  updateUser(user: Record<string, any>): Promise<ResultStatut> {
    return new Promise<ResultStatut>((resolve, reject) => {
      let r = {}
      if (user.hasOwnProperty('name')) { r['displayName'] = user.name; }
      if (user.hasOwnProperty('photoUrl')) { r['photoURL'] = user.photoUrl; }
      this.db.currentUser.updateProfile(r)
        .then(() => resolve(new ResultStatut()))
        .catch((error) => {
          // Bugsnag.notify(error)
          let result: ResultStatut = new ResultStatut();
          result.apiCode = error.error;
          result.message = error.getMessage();
        })
    });
  }

  createUserApi(email: string, password: string): Promise<ResultStatut> {
    let result: ResultStatut = new ResultStatut();
    return new Promise(async (resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          result.description = 'Account was created successful';
          result.result = userCredential;
          resolve(result);
        })
        .catch((error) => {
          // Bugsnag.notify(error)
          result.code = ResultStatut.UNKNOW_ERROR;
          result.apiCode = error.code;
          result.message = `error: ${error.code}`;
          result.description = `${error.message}`;
          reject(result);
        });
    });
  }

  handleConnexionState(callBack: ({ connected: boolean }) => void) {
    // firebase.database().ref('.info/connected').on('value', (snap) => {
    //   if (snap.val() === true) { callBack({ connected: true }); }
    //   else { callBack({ connected: false }); }
    // })
  }

  handleApiError(result: ResultStatut) {
    switch (result.apiCode) {
      case FireBaseConstant.AUTH_USER_NOT_FOUND:
      case FireBaseConstant.AUTH_WRONG_PASSWORD:
      case FireBaseConstant.AUTH_ACCOUNT_EXIST_WITH_DIFFERENT_CREDENTIAL:
        result.message = 'Incorrect email or password';
        break;
      case FireBaseConstant.AUTH_WEAK_PASSWORD:
        result.message = 'Password must have at least 6 characters';
        break;
      case FireBaseConstant.AUTH_EMAIL_ALREADY_USE:
        result.message = 'Email already used by another user';
        break;

      case FireBaseConstant.AUTH_REQUIRE_RECENT_LOGIN:
        result.message = 'You must log in to access the application. if you recently made a connection, you need to do it again';
        break;
      case FireBaseConstant.AUTH_CREDENTIAL_ALREADY_IN_USE:
        result.message = 'You are already connected';
        break;
      case FireBaseConstant.AUTH_TOO_MANY_REQUEST:
        result.message = result.description;
        break;
      case FireBaseConstant.DESACTIVED_ACCOUNT:
        result.message = 'Account Disabled. Please contact the administrator for a reactivation';
        break;
      case FireBaseConstant.AUTH_NETWORK_FAIL:
        result.message = 'Offline. Please check your network connectivity';
        break;
      case ResultStatut.INVALID_ARGUMENT_ERROR:
        break;
      default:
        let bug = new Bug(result);
        // this.eventService.newBugEvent.next(bug);
        //Bugsnag.notify(bug.error)
        result.message = 'Unknow error. Please contact administrator';
        break;
    }
  }
}

