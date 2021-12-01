import { Injectable } from '@angular/core';
import { ConfigAppService } from '../config-app/config-app.service';
import * as ConfigApp from "./../../entity/investment"
@Injectable({
    providedIn: 'root'
})
export class MembershipService {
    constructor(private configAppService:ConfigAppService){}

    // amountInvestment : valeur du investment acheté par le user
    // iduser : id du user
    // sponsorshipId : id du parrain du user
    // amBonSponsor = amount bonus sponsor : valeur actuel argent bonus du parrain récupéré avant avec son ID
    membership(amountInvestment: number, amBonSponsor,percent): number {
        // let nextAmount = amountInvestment * this.configAppService.bonus.getValue().bonus / 100;
        let nextAmount = amountInvestment * percent / 100;
        let bonus = amBonSponsor + nextAmount;
        return bonus; // implémenter la fonction d'ajout de bonus au parrain


    }
    membershipToAll(amountInvestment,parentBonus=0,grandParentBonnus=0,bigGrandParentBonnus=0)
    {
        let nextParentAmount=parentBonus+amountInvestment * ConfigApp.gainConfig.parentBonnus / 100;
        let nextGrandParentAmount=grandParentBonnus+amountInvestment * ConfigApp.gainConfig.grandParentBonnus / 100;
        let nextBigGrandParentAmount=bigGrandParentBonnus+amountInvestment * ConfigApp.gainConfig.bigGrandParentBonnus / 100;
        return {
            "parent":nextParentAmount,
            "grandParent":nextGrandParentAmount,
            "bigGrandParent":nextBigGrandParentAmount
        }
    }
}