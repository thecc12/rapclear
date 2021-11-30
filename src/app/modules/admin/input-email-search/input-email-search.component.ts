import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-email-search',
  templateUrl: './input-email-search.component.html',
  styleUrls: ['./input-email-search.component.css']
})
export class InputEmailSearchComponent implements OnInit {

  constructor() { }
  @Output() emailInputEvent = new EventEmitter<string>()
  emailInput:FormControl=new FormControl("")
  ngOnInit(): void {
  }

  sendValue()
  {
    this.emailInputEvent.emit(this.emailInput.value?this.emailInput.value:"");
  }

}
