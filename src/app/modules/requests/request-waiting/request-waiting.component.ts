import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Investment } from '../../../entity/investment';
import { User } from '../../../entity/user';
import { AuthService } from '../../../services/auth/auth.service';
import { ConfigAppService } from '../../../services/config-app/config-app.service';
import { EventService } from '../../../services/event/event.service';
import { BasicInvestmentService } from '../../../services/investment/basic-investment.service';
import { MarketService } from '../../../services/market/market.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-request-rejected',
  templateUrl: './request-waiting.component.html',
  styleUrls: ['./request-waiting.component.scss']
})
export class RequestWaitingComponent implements OnInit {
  currentInvestment: { waitResponse?: boolean, investment?: Investment, user?: User, selectForm?: FormControl } = {};
  @ViewChild('myModal') public myModal: ModalDirective;

  close: boolean;
  open: boolean;
  hasCurrentInvestment: boolean = false;
  resultOperation = { okresult: false, message: '' };

  constructor(private router: Router,
    private authService: AuthService,
    private modalService: BsModalService,
    private investmentService: BasicInvestmentService,
    private userService: UserService,
    private marketService: MarketService,
    private notification: NotificationService,
    // public translate: TranslateService,
    private configAppService: ConfigAppService,
    private eventService: EventService
  ) {

  }

  show() {
    // console.log("Show pack ",pack)
    // this.currentInvestment = investment;
    // this.hasCurrentInvestment = true;
    this.myModal.show();
  }

  ngOnInit(): void {
    }

    ok() {
      setTimeout(() => {
        // this.packs
        let state = this.resultOperation.okresult ? 'success' : 'danger';
        this.notification.showNotification('top', 'center', state, 'pe-7s-close-circle', this.resultOperation.message, 5000);
      }, 100);
      setTimeout(() => {
        this.router.navigate(['/user/']);
      }, 300);
    }
}
