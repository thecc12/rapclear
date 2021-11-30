import { User } from "./user";

/**
@author: Cedric nguendap
@description: Cette classe permet de générer un identifiant unique néccessaire pour la persistance
@created: 09/10/2020
*/
export class SponsorID {
    private _id: String="";
    constructor() {
    }
    /**
     * @description cette methode permet de générer un identifiant unique a 16 caractéres
     * @return une chaine de carractére de 16 éléments 
     */
    static generateId(user:User): SponsorID {
        let sponsorID=new SponsorID();
        let spon=user.fullName.split(" ")
                        .map((name)=> name.charAt(0))
                        .reduce((preString:string,currString:string)=>(preString+currString).toLowerCase());
        spon+=`${(new Date()).getUTCMilliseconds()}`;
        sponsorID.setId(spon);
        return sponsorID;
    }

    setId(id: String) {
        this._id = id;
    }

    toString(): String {
        return this._id;
    }
    toObject(): any {
        return this._id;
    }
}