import { Injectable } from '@angular/core';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { PlanService } from '../opperations/plan.service';
import { UserHistoryService } from '../user-history/user-history.service';

@Injectable({
  providedIn: 'root'
})
export class FindBonusService {

  constructor(
    private firebaseApi: FirebaseApi,
    private historyService: UserHistoryService,
    private planService: PlanService
  ) { 

  }
  
}
