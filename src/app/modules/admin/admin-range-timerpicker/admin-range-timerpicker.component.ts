import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-range-timerpicker',
  templateUrl: './admin-range-timerpicker.component.html',
  styleUrls: ['./admin-range-timerpicker.component.css']
})
export class AdminRangeTimerpickerComponent implements OnInit {
  @Input() start:string="";
  @Input() end:string=""
  constructor() { }

  ngOnInit(): void {
  }

}
