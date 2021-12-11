import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../entity/user';
import { EntityID } from '../../../entity/EntityID';
import { InvestmentState, Investment } from '../../../entity/investment';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { BasicInvestmentService } from '../../../services/investment/basic-investment.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';
import { ValidatorinputService } from '../../../services/validatorinput/validatorinput.service';
// import { AdminTimerpickerComponent } from '../../admin/admin-timerpicker/admin-timerpicker.component';
// import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-investment',
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.scss'],
  providers: [DatePipe]
})
export class AddInvestmentComponent implements OnInit {
  date: string = '';
  form: FormGroup;
  submitted: boolean = false;
  investmentStates: {text: String, value: InvestmentState}[] = [
    {text: 'Investment has initiated', value: InvestmentState.INITIATE},
    {text: 'Investment has refused ' , value: InvestmentState.REFUSE},
    {text: 'Investment has paid', value: InvestmentState.PAYED},
    {text: 'Investment has archived' , value: InvestmentState.ARCHIVED},
    {text: 'Investment is ready to pay' , value: InvestmentState.READY_TO_PAY},
    {text: 'Investment pending payment date' , value: InvestmentState.ON_WAITING_PAYMENT_DATE}
  ];

  waitResponse: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private investmentService: BasicInvestmentService,
    private userService: UserService,
    private notificationService: NotificationService,
    private validatorInput: ValidatorinputService,
    private router: Router,
    // private date: AdminTimerpickerComponent
    ) {
      let theDate = new Date(Date.now());
      // this.theDate = this.datePipe.transform(this.theDate, 'yyyy-MM-dd');
      this.date = theDate.getFullYear()+'-'+(theDate.getMonth()+1)+'-'+theDate.getDate(); 
      // console.log('today: ', this.date);
    }

  ngOnInit() {
    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      investmentState: new FormControl(this.investmentStates[0].value),
      investmentDate: new FormControl(''),
      planOption: new FormControl('', [Validators.required]),
      transactionId: new FormControl('', [Validators.required]),
      idOwner: new FormControl(localStorage.getItem('userId')),
    });
  }

  addInvestment() {
    this.submitted = true;
    if (this.form.invalid) { return; }
    if (this.form.value.amount <= 10000) {
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>Your investment must be greater than or equal to 10000.');
      return; }
    this.waitResponse = true;
    this.userService.getListUser();
    let idOwner: EntityID = new EntityID();
    // idOwner.setId(this.form.value.idOwner);
    idOwner.setId(localStorage.getItem('userId'));
    // console.log('investment: ', this.form);

    this.userService.getUserById(idOwner)
    .then((result: ResultStatut) => {
      let investment: Investment = new Investment();
      investment.amount = +this.form.value.amount;
      investment.plan = +this.form.value.planOption;
      investment.transactionId = this.form.value.transactionId;
      investment.investmentState = this.form.value.investmentState;
      investment.investmentDate = this.date;
      // investment.idBuyer.setId(' ');
      investment.idOwner = idOwner;
      return this.investmentService.addInvestment(investment, new User());
    })
    .then((result) => {
      this.waitResponse = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>Your investment has been initiated. This will be valid after payment confirmation');
      this.form.reset();
      this.submitted = false;
    })
    .catch((error: ResultStatut) => {
      this.waitResponse = false;
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);

    });
  }


  get f() {
    return this.form.controls;
}
}
