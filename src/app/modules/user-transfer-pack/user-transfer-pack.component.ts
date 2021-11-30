import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Message } from '../../../../shared/entity/chat';
import { Pack, PackBuyState } from '../../../../shared/entity/investment';
import { User } from '../../../../shared/entity/user';
import { ConfigAppService } from '../../../../shared/service/config-app/config-app.service';
import { ResultStatut } from '../../../../shared/service/firebase/resultstatut';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { PlanService } from '../../../../shared/service/opperations/plan.service';
import { BasicPackService } from '../../../../shared/service/investment/basic-investment.service';

@Component({
  selector: 'app-user-transfer-investment',
  templateUrl: './user-transfer-investment.component.html',
  styleUrls: ['./user-transfer-investment.component.css']
})
export class UserTransferPackComponent implements OnInit {
  // gainList = Object.keys(gainConfig).map((key) => Object.create({}, { value: { value: gainConfig[key] }, key: { value: key } }));
  gainList:{percent:string,numberOfDay:number}[]=[] 
  @Input() user:User;
  @Input() investment:Pack;
  waitResponse:boolean=false;
  emailForSearchUser:string=""
  selectedUser:User=null;
  submitted:boolean=false;
  form:FormGroup;

  constructor(
    private bsModalRef: BsModalRef,
    private investmentService:BasicPackService,
    private planService:PlanService,
    private notificationService:NotificationService,
    private configAppService:ConfigAppService
    ) { }

  ngOnInit(): void {
    //this.gainList.length>0?new FormControl(this.gainList[0].numberOfDay):new FormControl()
    this.configAppService.gains.subscribe((gain:{percent:string,numberOfDay:number}[])=>{
      this.gainList=gain;
    })

    this.form=new FormGroup({
      payDate:new FormControl("",[Validators.required]),
      plan: this.gainList.length>0?new FormControl(this.gainList[0].numberOfDay):new FormControl()
    });
  }
  setSelectedUser(user:User)
  {
    this.selectedUser=user;
  }
  selectedEmailUser(email)
  {
    this.emailForSearchUser=email;
  }
  close() {
    this.bsModalRef.hide();
  }
  confirm()
  {
    this.submitted=true;
    // console.log(this.form.valid,this.selectedUser)
    if(!this.form.valid) return;
    if(this.selectedUser==null) return;
    this.waitResponse=true;
    this.investment.idBuyer.setId(this.selectedUser.id.toString())

    let waintedGain = this.gainList.find((value)=>value.percent==this.form.value.plan)
    // console.log("WaintedGain ",waintedGain)
    this.investment.wantedGain.jour=waintedGain.numberOfDay;
    this.investment.wantedGain.pourcent=+waintedGain.percent;
    this.investment.nextAmount = this.planService.calculePlan(this.investment.amount,this.investment.wantedGain.jour);
    this.investment.saleDate=this.form.value.payDate;

    let message:Message=new Message();
    message.from.setId(this.selectedUser.id.toString());
    message.to.setId(this.user.id.toString());
    message.idPack.setId(this.investment.id.toString());
    this.investment.buyState=PackBuyState.ON_WAITING_SELLER_CONFIRMATION_PAIEMENT
    // console.log(this.investment,message)
    this.investmentService.confirmPaiementBySeller(this.investment,message,this.selectedUser,false)
    .then((result:ResultStatut)=>{
      this.waitResponse=false;
      this.form.reset();
      this.submitted=false;
      this.close();
      setTimeout(() => {
        this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The investment has been successfully added to the list of investments for this user',200);
      }, 200);
    })
    .catch((error:ResultStatut)=>{
      this.waitResponse=false;
      this.submitted=false;
      this.close();
      setTimeout(()=>{
        this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
        },
      200)   
    })
  }
}
