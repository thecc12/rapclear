import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-indeterminate',
  templateUrl: './progress-indeterminate.component.html',
  styleUrls: ['./progress-indeterminate.component.css']
})
export class ProgressIndeterminateComponent implements OnInit {
  @Input() message: String = '';
  constructor() { }

  ngOnInit(): void {
  }

}
