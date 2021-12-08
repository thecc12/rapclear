import { Entity, purgeAttribute } from './entity';
import { EntityID } from './EntityID';

export const MIN_RETREIVAL_BONUS = 15000;


export enum InvestmentState {

    INITIATE = 'initiate',
    REFUSE = 'refuse',
    ON_WAITING_PAYMENT_DATE = 'on_waiting_payment_date',
    READY_TO_PAY = 'ready_to_pay',
    PAYED = 'payed',
    ARCHIVED = 'archived'
}

export const gainConfig = {
    // '5': 15,
    // '10': 35,
    // '20': 85

    '10': 30,
    '20': 65,
    '30': 100,
    'parentBonnus': 10,
    'grandParentBonnus': 5,
    'bigGrandParentBonnus': 3
};

export class InvestmentGain extends Entity {
    pourcent: number = 0;
    jour: number = 0;
    init() {
        this.pourcent = 0;
        this.jour = 0;
    }
}

// investment representation
export class Investment extends Entity {

    amount: number = 0; // montant du investment
    bonusAmount: number = 0;
    nextAmount: number = 0; // montant a obtenir au paiement
    investmentDate: string = ''; // date de l'investissement
    paymentDate: string = ''; // date de paiement (new Date()).toISOString();
    plan: number = 0; // plan de l'achat ( 10 pour 10 jour, 20 pour 20 jours ...)
    idOwner: EntityID = new EntityID();
    investmentState: InvestmentState = InvestmentState.INITIATE;
    wantedGain: InvestmentGain = new InvestmentGain();
    transactionId: String = '';


    getBuyState() {
        switch (this.investmentState) {
            case InvestmentState.INITIATE:
                return 'Investment initiated';
        }
        return '';
    }

    hydrate(entity: Record<string | number, any>): void {
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key)) {
                if (key == 'id') { this.id.setId(entity.id); } else if (key == 'idOwner') {
                    this.idOwner.setId(entity.idOwner);
                } else if (key == 'wantedGain') {
                    this.wantedGain.hydrate(entity[key]);
                } else {
                    Reflect.set(this, key, entity[key]);
                }
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

