import { Component, Input, OnInit, Output,EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { EntityID } from '../../../entity/EntityID';
import { Request, RequestState } from '../../../entity/request';
import { User } from '../../../entity/user';
import { EventService } from '../../../services/event/event.service';
import { BasicRequestService } from '../../../services/request/basic-request.service';
import { RequestService } from '../../../services/request/request.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.css']
})
export class ListRequestComponent implements OnInit {
  @Input() requestType:RequestState=RequestState.STATE_FOR_ALL;
  @Input() label:String="";
  @Input() userOwner:User=null;
  @Output() selectRequestEvent:EventEmitter<Request>=new EventEmitter();
  @Input() forAll;
  @Input() showModal=true;

 

  requestList:Request[]=[];
  requestListCheck:Map<String,boolean>=new Map();
  requestListUsername:Map<String,User>=new Map();

  loadedData:boolean=false;

  selectedRequest:Request= new Request();
  constructor(
    private requestService:RequestService,
    private basicRequestService:BasicRequestService,
    private userService:UserService,
    private eventService:EventService,
    private modalService:BsModalService
  ) { }

  ngOnInit(): void {
    let observable:Observable<Request>;
    if(this.requestType==RequestState.STATE_FOR_ALL) 
    {
      if(this.forAll==true || this.forAll=="true") observable=this.basicRequestService.getRequest();
      else observable=this.basicRequestService.getUserRequest(this.userOwner.id);
    }
    else
    {
      if(this.forAll==true || this.forAll=="true") observable=this.basicRequestService.getAllUserRequestByState(this.requestType);
      else observable=this.basicRequestService.getUserRequestByState(this.userOwner.id,this.requestType);
    }
    this.eventService.newRequestArrivedEvent.subscribe((arrived)=>{
      if(arrived) this.loadedData=true;
    })
    observable.subscribe((request:Request)=>{
      // console.log("Request ",request)
      if(this.requestListCheck.has(request.id.toString()))
      {

      }
      else
      {
        this.requestList.push(request);
        this.requestListCheck.set(request.id.toString(),true);
        if(!this.requestListUsername.has(request.idOwner.toString()))
        {
          this.userService.getUserById(request.idOwner)
          .then((result)=>this.requestListUsername.set(request.idOwner.toString(),result.result))
        }
      }
    })

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
  clickToRequest(request:Request,template: TemplateRef<any>)
  {
    console.log("Request ",request)
    this.selectRequestEvent.next(request);
    this.selectedRequest=request;
    if(this.showModal==true)
    {
      this.modalService.show(template);
    }
  }
  getOwner(idOwner:EntityID)
  {
    return this.requestListUsername.has(idOwner.toString())? this.requestListUsername.get(idOwner.toString()):{"fullName":"","email":""};    
  }



}
