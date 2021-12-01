
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EntityID } from '../../entity/EntityID';
import { User } from '../../entity/user';
import { ResultStatut } from '../firebase/resultstatut';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class SponsorService {
    haveRef: boolean = false;
    
    constructor(
        private router: Router,
        private userService:UserService
        ) {
    }
    
    getDirectParentSponsorShipID(userID:EntityID):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve,reject)=>{
            this.userService.getUserById(userID)
            .then((result:ResultStatut)=>{
                let user:User=result.result;
                result.result=user.parentSponsorShipId;
                resolve(result);
            })
            .catch((error)=>reject(error))
        })
    }

    getGrandParentSponsorShipID(userID:EntityID):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve,reject)=>{
            this.userService.getUserById(userID)
            .then((result:ResultStatut)=>{
                let user:User=result.result;
                result.result=user.grandParentSponsorShipId;
                resolve(result);
            })
            .catch((error)=>reject(error))
        })
    }
    getBigGrandParentSponsorShipID(userID:EntityID):Promise<ResultStatut>
    {
        return new Promise<ResultStatut>((resolve,reject)=>{
            this.userService.getUserById(userID)
            .then((result:ResultStatut)=>{
                let user:User=result.result;
                result.result=user.bigGrandParentSponsorShipId;
                resolve(result);
            })
            .catch((error)=>reject(error))
        })
    }

    getSponsorId() {
        let href = this.router.url;
        let tab = href.split('/');
        if (tab[3]) {
            this.haveRef = true;
            localStorage.setItem('referal', tab[3]);
            console.log('tab: ', tab[3]);
            return tab[3];
        } else {
            // localStorage.setItem('referal', 'Referal: Automatic completion');
            return tab[3];
        }
    }
}
