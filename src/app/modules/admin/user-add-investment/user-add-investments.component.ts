import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Investment, InvestmentState } from '../../../entity/investment';
import { User } from '../../../entity/user';
import { ConfigAppService } from '../../../services/config-app/config-app.service';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { BasicInvestmentService } from '../../../services/investment/basic-investment.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { PlanService } from '../../../services/opperations/plan.service';
import { UserService } from '../../../services/user/user.service';
import { ValidatorinputService } from '../../../services/validatorinput/validatorinput.service';

@Component({
  selector: 'app-user-add-investment',
  templateUrl: './user-add-investment.component.html',
  styleUrls: ['./user-add-investment.component.css']
})
export class UserAddInvestmentComponent implements OnInit {
  @Input() user: User;
  form: FormGroup;
  submitted: boolean = false;
  investmentStates: {text: String, value: InvestmentState}[] = [
    {text: 'Investment initiated', value: InvestmentState.INITIATE},
    {text: 'Investment pending payment date' , value: InvestmentState.ON_WAITING_PAYMENT_DATE},
    {text: 'Investment archived', value: InvestmentState.ARCHIVED},
    {text: 'Investment paid' , value: InvestmentState.PAYED},
    {text: 'Investment is ready to pay', value: InvestmentState.READY_TO_PAY},
    {text: 'Investment refused' , value: InvestmentState.REFUSE}
  ];
  waitResponse: boolean = false;
  // gainList = Object.keys(gainConfig).map((key) => Object.create({}, { value: { value: gainConfig[key] }, key: { value: key } }));
  gainList: {percent: string, numberOfDay: number}[] = [];
  constructor(
    private bsModalRef: BsModalRef,
    private investmentService: BasicInvestmentService,
    private notificationService: NotificationService,
    private userService: UserService,
    private planService: PlanService,
    private validatorInput: ValidatorinputService,
    private configAppService: ConfigAppService

    // public dialogRef: MatDialogRef<UserAddInvestmentComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }
  close() {
    this.bsModalRef.hide();
  }
  ngOnInit(): void {
    this.configAppService.gains.subscribe((gain: {percent: string, numberOfDay: number}[]) => {
      this.gainList = gain;
    });

    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      investmentDate: new FormControl(''),
      plan: this.gainList.length > 0 ? new FormControl(this.gainList[0].numberOfDay) : new FormControl()

    });
  }
  confirm() {
    this.submitted = true;
    if (this.form.invalid) { return; }
    if (this.validatorInput.numberSanitize(this.form.value.amount)) {
      this.form.controls.amount.markAsDirty();
    }
    this.waitResponse = true;

    let investment: Investment = new Investment();
    let waintedGain = this.gainList.find((value) => value.percent == this.form.value.plan);
    // console.log("WaintedGain ",waintedGain)

    investment.amount = +this.form.value.amount;
    investment.plan = +waintedGain.numberOfDay;
    investment.amount = this.planService.calculePlan(investment.amount, investment.plan);

    let date: Date = new Date(this.form.value.investmentDate);
    date.setDate(date.getDate() + investment.plan);
    investment.paymentDate = date.toISOString();

    investment.investmentDate = this.form.value.investmentDate;
    // investment.idBuyer.setId(' ');
    investment.idOwner.setId(this.user.id.toString());

    // this.investmentService.addInvestment(investment, this.user)
    // .then((result) => {
    //   this.waitResponse = false;
    //   this.form.reset();
    //   this.submitted = false;
    //   this.close();
    //   setTimeout(() => {
    //     this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The investment has been successfully added to the list of investment');
    //   }, 200);
    // })
    // .catch((error: ResultStatut) => {
    //   this.waitResponse = false;
    //   setTimeout(() => {
    //     // tslint:disable-next-line:max-line-length
    //     this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);
    //     },
    //   200);
    // });
  }
}
