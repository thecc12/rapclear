import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.css']
})
export class TabItemComponent implements OnInit {
  @Input() title:String="";

  @ViewChild(TemplateRef)
  body: TemplateRef<any>;
  
  constructor() { }

  ngOnInit(): void {
  }

}
