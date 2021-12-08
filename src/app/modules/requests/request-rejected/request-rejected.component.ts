import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketService } from '../../../services/market/market.service';
import { Request } from '../../../entity/request';
import { EventService } from '../../../services/event/event.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../../entity/user';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-request-rejected',
  templateUrl: './request-rejected.component.html',
  styleUrls: ['./request-rejected.component.scss']
})
export class RequestRejectedComponent implements OnInit {
  currentRequest: { waitResponse?: boolean, request?: Request, user?: User, selectForm?: FormControl } = {};
  @ViewChild('myModal') public myModal: ModalDirective;
  waitData = true;
  listRejectedRequest: Request[] = [];
  listRejectedRequestCheck: Map<string, boolean> = new Map<string, boolean>();

  close: boolean;
  open: boolean;
  hasCurrentRequest: boolean = false;
  resultOperation = { okresult: false, message: '' };
  waitResponseSecondBtn: boolean = false;
  waitResponseBtn: boolean = false;


  constructor(
    private marketService: MarketService,
    private eventService: EventService,
    private notification: NotificationService) {
      this.waitData = true;
      this.marketService.getAllRejectedRequest().subscribe((request: Request) => {
        console.log('dans mService');
        this.waitData = false;
        if (!this.listRejectedRequestCheck.has(request.id.toString().toString())) {
          console.log('dans if');
          this.listRejectedRequestCheck.set(request.id.toString().toString(), true);
          this.listRejectedRequest.push(request);
        }
      });
  }

  ngOnInit() {
    console.log('dans ngOnInit');
    this.marketService.getAllRejectedRequest().subscribe((request: Request) => {
      this.waitData = false;
      if (!this.listRejectedRequestCheck.has(request.id.toString().toString())) {
        this.listRejectedRequestCheck.set(request.id.toString().toString(), true);
        this.listRejectedRequest.push(request);
      }
    });
    this.eventService.newRequestArrivedEvent.subscribe((result) => {
      if (result) { this.waitData = false; }});
  }

  getFormatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
  getFormatHours(date: string): string {
    if (date === '') { return date; }
    let stringDate = '';
    try {
      const d = new Date(date);
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
