import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityID } from '../../../../entity/EntityID';
import { InvestmentState, Investment } from '../../../../entity/investment';
import { User } from '../../../../entity/user';
import { ResultStatut } from '../../../../services/firebase/resultstatut';
import { BasicInvestmentService } from '../../../../services/investment/basic-investment.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { UserService } from '../../../../services/user/user.service';
import { ValidatorinputService } from '../../../../services/validatorinput/validatorinput.service';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-investment',
  templateUrl: './add-investment.component.html',
  styleUrls: ['./add-investment.component.scss']
})
export class AddInvestmentComponent implements OnInit {

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

  constructor(
    private investmentService: BasicInvestmentService,
    private userService: UserService,
    private notificationService: NotificationService,
    private validatorInput: ValidatorinputService,
    private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      amount: new FormControl('', [Validators.required]),
      investmentState: new FormControl(this.investmentStates[0].value),
      saleDate: new FormControl(''),
      idOwner: new FormControl('', [Validators.required, Validators.minLength(20)]),
    });
  }

  addInvestment() {//
    this.submitted = true;
    if (this.form.invalid) return;
    if (this.validatorInput.numberSanitize(this.form.value.amount))
    {
      this.form.controls.amount.markAsDirty();
    }
    this.waitResponse = true;
    this.userService.getListUser()
    let idOwner: EntityID = new EntityID();
    idOwner.setId(this.form.value.idOwner);


    this.userService.getUserById(idOwner)
    .then((result: ResultStatut) => {
      let investment: Investment = new Investment();
      investment.amount = +this.form.value.amount;
      investment.investmentState = this.form.value.investmentState;
      investment.paymentDate = this.form.value.saleDate;
      // investment.idBuyer.setId(' ');
      investment.idOwner = idOwner;
      // return this.investmentService.addInvestment(investment, new User());
    })
    .then((result) => {
      this.waitResponse = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The investment has been successfully added to the list of investments for this user');
      this.form.reset();
      this.submitted = false;
    })
    .catch((error: ResultStatut) => {
      this.waitResponse = false;
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);

    });
  }
}
