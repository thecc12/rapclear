import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge } from 'rxjs';
import { MarketService } from '../../../services/market/market.service';
import { UserService } from '../../../services/user/user.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { DataStateUpdateService } from '../../../services/data-state-update/data-state-update.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasicRequestService } from '../../../services/request/basic-request.service';
import { Request } from '../../../entity/request';

@Component({
  selector: 'app-request-panel',
  templateUrl: './request-panel.component.html',
  styleUrls: ['./request-panel.component.scss']
})
export class RequestPanelComponent implements OnInit  {
  waitData = true;
  listAllRequest: Request[] = [];
  listAllRequestCheck: Map<string, boolean> = new Map<string, boolean>();

  listInitiatedRequest: Request[] = [];
  listInitiatedRequestCheck: Map<string, boolean> = new Map<string, boolean>();

  listValidedRequest: Request[] = [];
  listValidedRequestCheck: Map<string, boolean> = new Map<string, boolean>();

  listWaitingPaymentDateRequest: Request[] = [];
  listWaitingPaymentDateRequestCheck: Map<string, boolean> = new Map<string, boolean>();

  listReadyToPayRequest: Request[] = [];
  listReadyToPayRequestCheck: Map<string, boolean> = new Map<string, boolean>();

  listRejectedRequest: Request[] = [];
  listRejectedRequestCheck: Map<string, boolean> = new Map<string, boolean>();



  waitResponseSecondBtn: boolean = false;
  waitResponseBtn: boolean = false;



  selectedRequestId: String = '';
  constructor(
    private marketService: MarketService,
    private userService: UserService,
    private notificationService: NotificationService,
    private basicRequestService: BasicRequestService,
    private dataUpdateService: DataStateUpdateService,
    private dialog: BsModalService
  ) {
    this.waitData = true;
    this.marketService.getAllInitiatedRequest().subscribe((request: Request) => {
      if (!this.listInitiatedRequestCheck.has(request.id.toString().toString())) {
        this.listInitiatedRequestCheck.set(request.id.toString().toString(), true);
        this.listInitiatedRequest.push(request);
        localStorage.setItem('listInitiatedRequest', this.listInitiatedRequest.length.toString());
      }
    });

    this.marketService.getAllValidedRequest().subscribe((request: Request) => {
      if (!this.listValidedRequestCheck.has(request.id.toString().toString())) {
        this.listValidedRequestCheck.set(request.id.toString().toString(), true);
        this.listValidedRequest.push(request);
        localStorage.setItem('listValidedRequest', this.listValidedRequest.length.toString());
      }
    });

    this.marketService.getAllRejectedRequest().subscribe((request: Request) => {
      if (!this.listRejectedRequestCheck.has(request.id.toString().toString())) {
        this.listRejectedRequestCheck.set(request.id.toString().toString(), true);
        this.listRejectedRequest.push(request);
        localStorage.setItem('listRejectedRequest', this.listRejectedRequest.length.toString());
      }
    });

    merge(
      this.marketService.getAllInitiatedRequest(),
      this.marketService.getAllValidedRequest(),
      this.marketService.getAllRejectedRequest()
    )
      .subscribe((request: Request) => {
        if (!this.listAllRequestCheck.has(request.id.toString().toString())) {
          this.listAllRequestCheck.set(request.id.toString().toString(), true);
          this.listAllRequest.push(request);
        }
      });
    console.log('qsdsdqsd: : : : ', this.listValidedRequest.length);
  }

  ngOnInit(): void {
    this.marketService.getAllInitiatedRequest().subscribe((request: Request) => {
      if (!this.listInitiatedRequestCheck.has(request.id.toString().toString())) {
        this.listInitiatedRequestCheck.set(request.id.toString().toString(), true);
        this.listInitiatedRequest.push(request);
        localStorage.setItem('listInitiatedRequest', this.listInitiatedRequest.length.toString());
      }
      this.waitData = false;
    });

    this.marketService.getAllValidedRequest().subscribe((request: Request) => {
      if (!this.listValidedRequestCheck.has(request.id.toString().toString())) {
        this.listValidedRequestCheck.set(request.id.toString().toString(), true);
        this.listValidedRequest.push(request);
        localStorage.setItem('listValidedRequest', this.listValidedRequest.length.toString());
      }
      this.waitData = false;
    });

    this.marketService.getAllRejectedRequest().subscribe((request: Request) => {
      if (!this.listRejectedRequestCheck.has(request.id.toString().toString())) {
        this.listRejectedRequestCheck.set(request.id.toString().toString(), true);
        this.listRejectedRequest.push(request);
        localStorage.setItem('listRejectedRequest', this.listRejectedRequest.length.toString());
      }
      this.waitData = false;
    });

    merge(
      this.marketService.getAllInitiatedRequest(),
      this.marketService.getAllValidedRequest(),
      this.marketService.getAllRejectedRequest()
    )
      .subscribe((request: Request) => {
        if (!this.listAllRequestCheck.has(request.id.toString().toString())) {
          this.listAllRequestCheck.set(request.id.toString().toString(), true);
          this.listAllRequest.push(request);
        }
      });
  }

  getFormatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
  getFormatHours(date: string): string {
    if (date == '') { return date; }
    let stringDate = '';
    try {
      let d = new Date(date);
      if (d.getHours() < 10) { stringDate = `0${d.getHours()}H:`; } else { stringDate = `${d.getHours()}H:`; }

      if (d.getMinutes() < 10) { stringDate += `0${d.getMinutes()} Min`; } else { stringDate += `${d.getMinutes()} Min`; }
    } catch (err) {
      console.log(err);
    }

    return stringDate;
  }


  refreshFonct() {
    window.location.reload();
  }

}
