import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-gain-input',
  templateUrl: './gain-input.component.html',
  styleUrls: ['./gain-input.component.css']
})
export class GainInputComponent implements OnInit {
  formControl: FormControl;
  @Input()value = '';
  constructor() { }

  ngOnInit(): void {
    this.formControl = new FormControl();
    this.formControl.setValue(this.value);
  }
  getValue() {
    return this.formControl.value;
  }

}
