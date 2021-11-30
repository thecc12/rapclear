import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';

declare var M;

@Component({
  selector: 'app-tab-material',
  templateUrl: './tab-material.component.html',
  styleUrls: ['./tab-material.component.css','./../../../../assets/css/materialize.min.css']
})
export class TabMaterialComponent implements OnInit,AfterViewInit {
  
  constructor(private tab:ElementRef) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    M.Tabs.init(this.tab.nativeElement.querySelectorAll('.tabs'), {
      swipeable :true
    });
  }

}
