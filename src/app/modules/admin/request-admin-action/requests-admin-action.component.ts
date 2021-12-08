import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Request, RequestState } from '../../../entity/request';
import { DataStateUpdateService } from '../../../services/data-state-update/data-state-update.service';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { BasicRequestService } from '../../../services/request/basic-request.service';
import { MarketService } from '../../../services/market/market.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-requests-admin-action',
  templateUrl: './requests-admin-action.component.html',
  styleUrls: ['./requests-admin-action.component.css']
})
export class RequestsAdminActionComponent implements OnInit, OnChanges {
  @Input() request: Request = new Request();
  selectedRequestId: String = '';

  waitResponse: boolean = false;
  waitResponseSecond: boolean = false;
  waitResponseThird: boolean = false;
  waitResponseFour: boolean = false;

  constructor(
    private basicRequestService: BasicRequestService,
    private marketService: MarketService,
    private userService: UserService,
    private notificationService: NotificationService,
    private dataUpdateService: DataStateUpdateService,
    private dialog: BsModalService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes ', changes);
  }

  ngOnInit(): void {

  }

  refuseRequest(request: Request) {
    if (this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) { return; }
    this.waitResponse = true;
    this.selectedRequestId = request.id.toString();
    console.log(request);
    this.basicRequestService.rejectRequestStatus(request.id)
    .then((result: ResultStatut) => {
      this.waitResponse = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The status of the request is now \<b>Rejected\</b>`, 200);
      this.selectedRequestId = '';
    })
    .catch((error: ResultStatut) => {
      this.waitResponse = false;
      this.selectedRequestId = '';
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
    });
  }

  confirmRequest(request: Request) {
    if (this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) { return; }
    this.waitResponse = true;
    this.selectedRequestId = request.id.toString();
    console.log(request);
    this.basicRequestService.approuveRequestStatus(request.id)
    .then((result: ResultStatut) => {
      this.waitResponse = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br>The status of the request is now \<b>On Waiting Payment Date\</b>`, 200);
      this.selectedRequestId = '';
    })
    .catch((error: ResultStatut) => {
      this.waitResponse = false;
      this.selectedRequestId = '';
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
    });
  }

  deleteRequest(request: Request) {
    if (this.waitResponse || this.waitResponseSecond || this.waitResponseThird || this.waitResponseFour) { return; }
    this.waitResponseSecond = true;
    this.selectedRequestId = request.id.toString();
    this.basicRequestService.deleteRequest(request)
    .then((result: ResultStatut) => {
      this.selectedRequestId = '';
      this.waitResponseSecond = false;
      this.notificationService.showNotification('top', 'center', 'success', 'pe-7s-close-circle', `\<b>Success !\</b>\<br> The request has been deleted successfully `, 200);
    })
    .catch((error: ResultStatut) => {
      this.waitResponseSecond = false;
      this.selectedRequestId = '';
      // tslint:disable-next-line:max-line-length
      this.notificationService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Error !\</b>\<br>' + error.message);
    });
  }

}
