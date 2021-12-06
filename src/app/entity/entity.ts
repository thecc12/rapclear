import { EntityID } from "./EntityID";

export class Entity {
    id: EntityID = new EntityID();

    hydrate(entity: Record<string | number, any>): void {
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key)) {
                if (key == "id") this.id.setId(entity.id)
                else Reflect.set(this, key, entity[key]);
            }
        }
    }

    toString(): Record<string | number, any> {
        let r = {};
        for (const k of Object.keys(this)) {
            if (k == "id")  r[k]= this.id.toString()
            else r[k] = Reflect.get(this, k);
        }
        return r;
    }
}


export function generateId(): String {
    // tslint:disable-next-line:no-bitwise
    let timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
        // tslint:disable-next-line:no-bitwise
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
}

export function purgeAttribute(ref, object: Record<string | number, any>, attr: String): any {
    if (object == null || object == undefined) {return null; }
    if (object.hasOwnProperty(attr.toString())) {return object[attr.toString()]; }
    if (ref.hasOwnProperty(attr.toString())) {return Reflect.get(ref, attr.toString()); }
    return null;
}
