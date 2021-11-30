import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
// import { User } from 'firebase';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Investment } from '../../../entity/investment';
import { User } from '../../../entity/user';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { BasicInvestmentService } from '../../../services/investment/basic-investment.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-split-admin-investment',
  templateUrl: './split-admin-investment.component.html',
  styleUrls: ['./split-admin-investment.component.css']
})
export class SplitAdminInvestmentComponent implements OnInit {
  @Input() investment: Investment = new Investment();
  @Input() user: User = new User();
  nextAmount: number = 0;
  reduceFormControl: FormControl;
  submitted: boolean = false;
  waitResponse: boolean = false;
  constructor(
    private bsModalRef: BsModalRef,
    private basicInvestmentService: BasicInvestmentService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.nextAmount = this.investment.amount;
    this.reduceFormControl = new FormControl('', [Validators.required, Validators.min(1000)]);
    this.reduceFormControl.valueChanges.subscribe((value) => {
      if (!value) { this.nextAmount = this.investment.amount }
      else { this.nextAmount = Math.round((this.investment.amount - parseInt(value)) * 100) / 100; }
    });
  }
  close() {
    this.bsModalRef.hide();
  }
  confirm()
  {
    this.submitted = true;
    if (!this.reduceFormControl.valid) { return; }
    this.waitResponse = true;
    // this.basicInvestmentService.splitInvestment(this.investment, this.reduceFormControl.value)
    // .then((result: ResultStatut) => {
    //   this.submitted = false;
    //   this.waitResponse = false;
    //   this.close();
    //   setTimeout(() => {
    //     this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Success !\</b>\<br>The investment has been successfully divided');
    //   }, 200);

    // })
    // .catch((error: ResultStatut) => {
    //   this.submitted = false;
    //   this.waitResponse = false;
    //   this.close();
    //   setTimeout(() => {
    //     this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);
    //     },
    //   200)
    // });
  }
}
