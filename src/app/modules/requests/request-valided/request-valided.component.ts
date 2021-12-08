import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MarketService } from '../../../services/market/market.service';
import { Request } from '../../../entity/request';
import { EventService } from '../../../services/event/event.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { User } from '../../../entity/user';

@Component({
  selector: 'app-request-valided',
  templateUrl: './request-valided.component.html',
  styleUrls: ['./request-valided.component.scss']
})
export class RequestValidedComponent implements OnInit {
  currentRequest: { waitResponse?: boolean, request?: Request, user?: User, selectForm?: FormControl } = {};
  @ViewChild('myModal') public myModal: ModalDirective;
  waitData = true;
  listValidedRequest: Request[] = [];
  listValidedRequestCheck: Map<string, boolean> = new Map<string, boolean>();

  close: boolean;
  open: boolean;
  hasCurrentRequest: boolean = false;
  resultOperation = { okresult: false, message: '' };
  waitResponseSecondBtn: boolean = false;
  waitResponseBtn: boolean = false;


  constructor(
    private marketService: MarketService,
    private eventService: EventService) {
      this.waitData = true;
      this.marketService.getAllValidedRequest().subscribe((request: Request) => {
        // console.log('dans mService');
        this.waitData = false;
        if (!this.listValidedRequestCheck.has(request.id.toString().toString())) {
          console.log('dans if');
          this.listValidedRequestCheck.set(request.id.toString().toString(), true);
          this.listValidedRequest.push(request);
          // localStorage.setItem('listValidedRequest', this.listValidedRequest.length.toString());
        }
      });
  }

  ngOnInit() {
    console.log('dans ngOnInit');
    this.marketService.getAllValidedRequest().subscribe((request: Request) => {
      this.waitData = false;
      if (!this.listValidedRequestCheck.has(request.id.toString().toString())) {
        this.listValidedRequestCheck.set(request.id.toString().toString(), true);
        this.listValidedRequest.push(request);
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
