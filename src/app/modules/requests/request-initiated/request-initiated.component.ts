import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../../entity/user';
import { AuthService } from '../../../services/auth/auth.service';
import { ConfigAppService } from '../../../services/config-app/config-app.service';
import { EventService } from '../../../services/event/event.service';
import { MarketService } from '../../../services/market/market.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';
import { Request } from '../../../entity/request';
import { BasicRequestService } from '../../../services/request/basic-request.service';

@Component({
  selector: 'app-request-initiated',
  templateUrl: './request-initiated.component.html',
  styleUrls: ['./request-initiated.component.scss']
})
export class RequestInitiatedComponent implements OnInit {
  currentRequest: { waitResponse?: boolean, request?: Request, user?: User, selectForm?: FormControl } = {};
  @ViewChild('myModal') public myModal: ModalDirective;

  close: boolean;
  open: boolean;
  hasCurrentRequest: boolean = false;
  resultOperation = { okresult: false, message: '' };
  waitData = true;
  listInitiatedRequest: Request[] = [];
  listInitiatedRequestCheck: Map<string, boolean> = new Map<string, boolean>();


  waitResponseSecondBtn: boolean = false;
  waitResponseBtn: boolean = false;

  constructor(private router: Router,
    private authService: AuthService,
    private modalService: BsModalService,
    private requestService: BasicRequestService,
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
    // this.currentRequest = request;
    // this.hasCurrentRequest = true;
    this.myModal.show();
  }

  ngOnInit(): void {
    console.log('dans ngOnInit');
    this.marketService.getAllInitiatedRequest().subscribe((request: Request) => {
      this.waitData=false;
      if (!this.listInitiatedRequestCheck.has(request.id.toString().toString())) {
        this.listInitiatedRequestCheck.set(request.id.toString().toString(), true);
        this.listInitiatedRequest.push(request);
      }
    });
    this.eventService.newRequestArrivedEvent.subscribe((result) => {
      if (result) { this.waitData = false; }});
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
