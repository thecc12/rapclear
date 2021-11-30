import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Market, MarketState } from '../../entity/market';
import { FirebaseApi } from '../firebase/FirebaseApi';
import { ResultStatut } from '../firebase/resultstatut';

export interface BonusHeritage
{
  firstParent:number,
  secondParent:number,
  thirdParent:number,
  fourParent:number
}

@Injectable({
  providedIn: 'root'
})
export class ConfigAppService {
  market:BehaviorSubject<Market>=new BehaviorSubject<Market>(new Market());
  isForcedOpenMarketStatus:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  gains:BehaviorSubject<{percent:string,numberOfDay:number}[]>=new BehaviorSubject<{percent:string,numberOfDay:number}[]>([])
  // bonus:BehaviorSubject<BonusHeritage>=new BehaviorSubject<BonusHeritage>({firstParent:0,secondParent:0,thirdParent:0,fourParent:0})
  bonus:BehaviorSubject<{bonus:number,minBonus:number}> = new BehaviorSubject<{bonus:number,minBonus:number}>({bonus:0,minBonus:0});
  constructor(private firebaseApi:FirebaseApi,
    private router:Router) {
    this.firebaseApi.getFirebaseDatabase()
    .ref("config")
    .on("value",(data)=>{
      let dataConfig=data.val();
      if(dataConfig.market)
      {
        let market:Market=new Market();
        market.hydrate(dataConfig.market);
        this.market.next(market);
        this.isForcedOpenMarketStatus.next(market.state==MarketState.OPEN)
      }
      // console.log("gains ",dataConfig)
      if(dataConfig.gains)
      {
        let g:{percent:string,numberOfDay:number}[]=[]
        for(const key in dataConfig.gains) g.push({percent:key,numberOfDay:dataConfig.gains[key]})
        this.gains.next(g);
      }

      if(dataConfig.bonus)  
      {
        this.bonus.next(dataConfig.bonus);
        console.log(dataConfig.bonus)
      }
    })
  }

  checkBeforSave(market:Market):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.fetchOnce("config/market/state")
      .then((result:ResultStatut)=>{
        if(result.result!=market.state) return this.saveMarket(market)
        return Promise.resolve(new ResultStatut())
      })
      .then((result:ResultStatut)=>resolve(result))
      .catch((error:ResultStatut)=>reject(error))
    })
  }

  saveMarket(market:Market):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.set("config/market",market.toString())
      .then((result:ResultStatut)=>{
        // console.log("Result ",result)
        this.market.next(market);
        resolve(result)
      })
      .catch((error:ResultStatut)=>{
        this.firebaseApi.handleApiError(error);
        reject(error);
      })
    })
  }

  saveBonus(bonus:{bonus:number,minBonus:number}):Promise<ResultStatut>
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.set("config/bonus",bonus)
      .then((result:ResultStatut)=>{
        this.bonus.next(bonus);
        resolve(result)
      })
      .catch((error:ResultStatut)=>{
        this.firebaseApi.handleApiError(error);
        reject(error);
      })
    })
  }
  saveGain(gains:{percent,numberOfDay}[]):Promise<ResultStatut>
  {
    let gainsList={};
    gains.forEach((gain:{percent,numberOfDay})=>{
      gainsList[gain.percent]=gain.numberOfDay
    })
    return new Promise<ResultStatut>((resolve,reject)=>{
      this.firebaseApi.set(`config/gains`,gainsList)
      .then((result:ResultStatut)=> {
        this.gains.next(gains)
        resolve(new ResultStatut())
      })
      .catch((error:ResultStatut)=>{
        this.firebaseApi.handleApiError(error);
        reject(error);
      })
    })
  }

  checkOpenTime()
  {
      let dateNow:Date=new Date();
      let isOpen=false;
      for(let time of this.market.getValue().openTime)
      {
        let startDate:Date=new Date();
        startDate.setHours(parseInt(time.start.split(':')[0]))
        startDate.setMinutes(parseInt(time.start.split(':')[1]))

        let endDate:Date=new Date();
        endDate.setHours(parseInt(time.end.split(':')[0]))
        endDate.setMinutes(parseInt(time.end.split(':')[1]))

        if(dateNow>=startDate && dateNow<=endDate) isOpen=true;
      } 
      return isOpen;
  }

  checkMarketTime()
  {
    let href = this.router.url;
    let tab = href.split('/');
    let isOpen = this.checkOpenTime();
    // console.log("isOpen ",isOpen)   
    if (tab[1] === 'market') {
      if(this.isForcedOpenMarketStatus.getValue()) return this.router.navigate(['market/open']); 
        if(isOpen && this.market.getValue().state==MarketState.CLOSE)
        {
          this.market.getValue().state=MarketState.OPEN;
          this.checkBeforSave(this.market.getValue())
          return this.router.navigate(['market/open']);
        }
        if(!isOpen && this.market.getValue().state==MarketState.OPEN)
        {
          this.market.getValue().state=MarketState.CLOSE;
          this.checkBeforSave(this.market.getValue())
          return this.router.navigate(['market/wait']);
        }
        if(isOpen) return this.router.navigate(['market/open']);
        else return this.router.navigate(['market/wait'])

    }
  }
  switchMarketState()  
  {
    return new Promise<ResultStatut>((resolve,reject)=>{
      let marketState:MarketState=this.market.getValue().state==MarketState.CLOSE?MarketState.OPEN:MarketState.CLOSE; 
      this.firebaseApi.updates([
        {
          link:"config/market/state",
          data:marketState
        }
      ])
      .then((result:ResultStatut)=>{
        this.market.getValue().state=marketState;
        resolve(result);
      })
      .catch((error:ResultStatut)=>{
        this.firebaseApi.handleApiError(error);
        reject(error);
      })
    })
  }
}
