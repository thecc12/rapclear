import { Entity } from './entity';
import { SponsorID } from './sponsorid';

export enum UserAccountState {
    ACTIVE = 'active',
    DESACTIVE = 'desactive'
}

export class User extends Entity {
    email: string = '';
    password: string = '';
    name: string = '';
    fullName: string = '';
    nicNumber: string = ''; // CNI num
    emailVerified: boolean = false;
    phone: string = '';
    country: string = '';
    city: string = '';
    mySponsorShipId: SponsorID = new SponsorID(); // id de parrainage
    parentSponsorShipId: SponsorID = new SponsorID(); // id de parent de parrainage
    status: UserAccountState = UserAccountState.ACTIVE; // statu du compte ( true pour actif, false pour désactivé )
    photoUrl: string = '';
    network: string = '';
    user_agree: boolean = true;
    bonus: number = 0;
    dateCreation: string = '';

    hydrate(entity: Record<string | number, any>): void {
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key)) {
                if (key == 'id') { this.id.setId(entity.id); }
                else if (key == 'mySponsorShipId') this.mySponsorShipId.setId(entity.mySponsorShipId); 
                else if (key == 'parentSponsorShipId') this.parentSponsorShipId.setId(entity.parentSponsorShipId); 
                else { Reflect.set(this, key, entity[key]); }
            }
        }
    }

    toString(): Record<string | number, any> {
        let r = {};
        for (const k of Object.keys(this)) {
            if (k == 'id') { r[k] = this.id.toString(); }
            else if (k == 'mySponsorShipId')  r[k] = this.mySponsorShipId.toString();
            else if (k == 'parentSponsorShipId') r[k] = this.parentSponsorShipId.toString();
            else { r[k] = Reflect.get(this, k); }
        }
        return r;
    }
}
