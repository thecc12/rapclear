import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ServiceOfProvider } from '../../entity/provider';

@Injectable({
  providedIn: 'root'
})
export class ServiceOfProviderLocalStorageService {

  dataService:BehaviorSubject<ServiceOfProvider>=new BehaviorSubject<ServiceOfProvider>(new ServiceOfProvider());
  constructor(private router:Router) {
    this.getDataWhenNavStart();
   }

  getDataWhenNavStart()
  {
    this.router.events.subscribe((evt)=> {     
      if(evt instanceof NavigationEnd)
      {
        if(localStorage.getItem("serviceofprovider"))
        {
            let service:ServiceOfProvider=new ServiceOfProvider();
            service.hydrate(JSON.parse(localStorage.getItem("serviceofprovider")))
            this.dataService.next(service);
        }
      }
    })
  }
  setData(data:ServiceOfProvider)
  {
    localStorage.setItem("serviceofprovider",JSON.stringify(data.toString()));
    this.dataService.next(data);
  }
  clearData()
  {
    localStorage.removeItem("serviceofprovider");
    this.dataService.next(new ServiceOfProvider());
  }
}
