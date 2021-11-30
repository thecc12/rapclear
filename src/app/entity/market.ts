import { Entity } from './entity';

export enum MarketState {
    OPEN= 'open',
    CLOSE= 'close'
}

export class MarketOpenTime extends Entity {
    start: String = '';
    end: String = '';
}

export class Market extends Entity {
    state: MarketState = MarketState.CLOSE;
    openTime: MarketOpenTime[] = [];
    hydrate(entity: Record<string | number, any>): void {
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key)) {
                if (key == 'openTime') {
                    for (const id of Object.keys(entity[key])) {
                        let time = new MarketOpenTime();
                        time.hydrate(entity[key][id]);
                        this.openTime.push(time);
                    }
                } else if (key == 'id') {
                    this.id.setId(entity[key]); } else {
                    Reflect.set(this, key, entity[key]); }
            }
        }
    }

    toString(): Record<string | number, any> {
        let r = {};
        for (const k of Object.keys(this)) {
            if (k == 'openTime') {
                let t = {};
                this.openTime.forEach((time: MarketOpenTime) => {
                    t[time.id.toString().toString()] = time.toString();
                });
                r[k] = t;
            } else if (k == 'id') r[k] = this.id.toString();
            else r[k] = Reflect.get(this, k);
        }
        return r;
    }
}