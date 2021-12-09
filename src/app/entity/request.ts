import { Entity } from './entity';
import { EntityID } from './EntityID';

export enum RequestState {
    STATE_FOR_ALL="all",
    INITIATE = 'initiated',
    VALIDED = 'valided',
    REJECTED = 'rejected',
    ARCHIVED = 'archived',
}

export class Request extends Entity {
    idOwner: EntityID = new EntityID(); // id du user qui soumet la requette
    requestSubject: string = ''; // Motif de la requete
    requestContent: string = ''; // contenu textuel de la requette
    requestDate: string = ''; // The request date
    // tslint:disable-next-line:max-line-length
    requestState: RequestState = RequestState.INITIATE; // statu de la requette ( ON_WAITIN lorsque le user soumet, VALIDED lorsque vérifié et approuvé par l'admin, REJECTED lorsque vérifié et refusé par l'admin )
    imgUrl: string = ''; // lien vers Image de capture

    getBuyState() {
        switch (this.requestState) {
            case RequestState.INITIATE:
                return 'Investment initiated';
        }
        return '';
    }

    hydrate(entity: Record<string | number, any>): void {
        // console.log("Entity ",entity)
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key)) {
                if (key == 'id') this.id.setId(entity.id)
                else if (key == 'idOwner') this.idOwner.setId(entity.idOwner)
                else  Reflect.set(this, key, entity[key])
            }
        }
    }

    getDateOf(dateString):Date
    {
        return new Date(dateString);
    }

    toString(): Record<string | number, any> {
        let r = {};
        for (const k of Object.keys(this)) {
            if (k == 'id') { r[k] = this.id.toString(); } else if (k == 'idOwner') {
                r[k] = this.idOwner.toString();
            } else if (k == 'wantedGain ') {
                r[k] = this.toString(); } else {
                    r[k] = Reflect.get(this, k); }
        }
        return r;
    }
}
