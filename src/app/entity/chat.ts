import { Entity } from './entity';
import { EntityID } from './EntityID';

export enum MessageReadState {
    UNREAD= 'unread',
    READ= 'read'
}

export class Message extends Entity {
    from: EntityID = new EntityID();
    to: EntityID = new EntityID();
    date: String = '';
    content: String = '';
    read: MessageReadState = MessageReadState.UNREAD;
    idInvestment: EntityID = new EntityID();
    idDiscussion: String = '';

    hydrate(entity: Record<string | number, any>): void {
        for (const key of Object.keys(entity)) {
            if (Reflect.has(this, key)) {
                if (key == 'id') this.id.setId(entity.id)
                else if (key == 'from') this.from.setId(entity.from)
                else if (key == 'to') this.to.setId(entity.to)
                else if (key == 'idInvestment') this.idInvestment.setId(entity.idInvestment)
                else Reflect.set(this, key, entity[key]);
            }
        }
    }

    toString(): Record<string | number, any> {
        let r = {};
        for (const k of Object.keys(this)) {
            if (k == 'id')  r[k] = this.id.toString()
            else if (k == 'from') r[k] = this.from.toString();
            else if (k == 'to') r[k] = this.to.toString();
            else if (k == 'idInvestment') r[k] = this.idInvestment.toString();
            else r[k] = Reflect.get(this, k);
        }
        return r;
    }

}

export class Discussion {
    _id: String = '';
    inter1: String = '';
    inter2: String = '';
    idProject: String = '';
    chats: Message[] = [];
    read: number = 0;

    toString() {
        return {
            _id: this._id,
            inter1: this.inter1,
            inter2: this.inter2,
            chats: this.chats.map((chat) => chat.toString()),
            idProject: this.idProject,
            read: this.read
        }; 
    }
    static hydrate(entity: any): Discussion {
        let d: Discussion = new Discussion();
        for (const key in entity) {
            // if(key=="chats") d.chats=purgeAttribute(d,entity,"chats")
            //     ?purgeAttribute(d,entity,"chats").map((chat:Record<string,any>)=> {
            //         let m:Message=Message.hydrate(chat);
            //         m.idDiscussion=entity._id;
            //         return m;
            //     })
            //     :[];
            // else Reflect.set(d,key,purgeAttribute(d,entity,key)); 
        }
        return d;        
    }


}