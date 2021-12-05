import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Investment } from '../../../entity/investment';
import { BasicInvestmentService } from '../../../services/investment/basic-investment.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-confirmed-investment',
  templateUrl: './confirmed-investment.component.html',
  styleUrls: ['./confirmed-investment.component.scss']
})
export class ConfirmedInvestmentComponent implements OnInit {

  investments: { waitResponse: boolean, investment: Investment }[] = [];
  search = '';
  searchInvestments: { waitResponse: boolean, investment: Investment }[] = [];

  constructor(private investmentService: BasicInvestmentService, private notifService: NotificationService) { }

  ngOnInit() {
    this.getMyConfirmedInvestments();
  }

  getMyConfirmedInvestments() {

  }

}
