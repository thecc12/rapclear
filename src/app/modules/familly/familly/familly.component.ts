import { Component, OnInit } from '@angular/core';
import { User } from '../../../entity/user';
import { EventService } from '../../../services/event/event.service';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { NotificationService } from '../../../services/notification/notification.service';
import { ProfilService } from '../../../services/profil/profil.service';
// import { UserFamillyService } from '../../../../shared/service/user-familly/user-familly.service';


@Component({
  templateUrl: 'familly.component.html',
  styleUrls: ['./familly.component.scss']
})

export class FamillyComponent implements OnInit {
  fieuls: {user:User,nberInvestment}[] = [];
  waitData=true;
  constructor(private notification: NotificationService,
    private userProfil: ProfilService,
    private eventService:EventService
    ) {
  }

  ngOnInit() {
    this.eventService.syncFamilyEvent.subscribe((sync:boolean)=>{
      if(sync) this.getInvestmentsFamilly();
    })
  }

  getInvestmentsFamilly() {
    this.userProfil.getFieulList()
    .then((result:ResultStatut)=>{
      console.log("Fielys ",result.result)
      this.fieuls=result.result;
      this.waitData=false;
    })
    .catch((error)=>{
      this.waitData=false;
    })
  }

  showNotification(from, align, colortype, icon, text) {
    this.notification.showNotification(from, align, colortype, icon, text);
  }
}

