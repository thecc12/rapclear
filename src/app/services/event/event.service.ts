import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Bug } from '../../entity/bug';
import { Investment } from '../../entity/investment';
import { User } from '../../entity/user';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  loginEvent = new BehaviorSubject<User>(null);
  logoutEvent = new BehaviorSubject<boolean>(false);
  loginAdminEvent = new BehaviorSubject<boolean>(false);
  registerNewUserEvent = new BehaviorSubject<User>(null);
  addInvestmentEvent = new BehaviorSubject<Investment>(null);
  shouldPaidInvestmentEvent = new BehaviorSubject<Investment>(null);
  investmentPaidEvent = new BehaviorSubject<Investment>(null);
  newInvestmentArrivedEvent = new BehaviorSubject<boolean>(false);
  newBugEvent = new BehaviorSubject<Bug>(null);
  syncFamilyEvent = new BehaviorSubject<boolean> (true);
}
