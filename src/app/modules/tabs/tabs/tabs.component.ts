import { AfterContentInit, AfterViewInit, Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import "materialize-css/dist/js/materialize.min"
import { TabItemComponent } from '../tab-item/tab-item.component';

declare var M:any;


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit,AfterContentInit,AfterViewInit {

  @ContentChildren(TabItemComponent) tabs: QueryList<TabItemComponent>;
  shouldShow=false;

  constructor() { }
  
  
  ngOnInit(): void {   
    
  }

  ngAfterContentInit(): void {
    
  }

  ngAfterViewInit(): void {
    var instance = M.Tabs.init(document.querySelectorAll('.tabs'), {duration:300});
    setTimeout(()=>this.shouldShow=true)
  }
  

}
