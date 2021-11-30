import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TimepickerComponent } from 'ngx-bootstrap/timepicker';

@Component({
  selector: 'app-admin-timerpicker',
  templateUrl: './admin-timerpicker.component.html',
  styleUrls: ['./admin-timerpicker.component.css']
})
export class AdminTimerpickerComponent implements OnInit, AfterViewInit {

  @ViewChild('timepicker') timePicker: TimepickerComponent;
  @Input() time: string = '';
  newTime = new Date();

  constructor() {

  }

  ngOnInit(): void {
    let d = new Date().toISOString().split('T')[1].split(':');
    if (this.time.indexOf(':') > -1) {
      // tslint:disable-next-line:radix
      this.newTime.setHours(parseInt(this.time.split(':')[0]));
      // tslint:disable-next-line:radix
      this.newTime.setMinutes(parseInt(this.time.split(':')[1]));
    }
  }

  ngAfterViewInit(): void {
    this.timePicker.showMeridian = false;
  }
  getTime(): String
  {
    return `${this.timePicker.hours}:${this.timePicker.minutes}`;
  }
  getHours()
  {
    return this.timePicker.hours;
  }
  getMinutes()
  {
    return this.timePicker.minutes;
  }

}
