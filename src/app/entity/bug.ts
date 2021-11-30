import { ResultStatut } from '../services/firebase/resultstatut';
import { Entity } from './entity';

export class Bug extends Entity {
    date: Date = new Date();
    user = null;
    resultAction: ResultStatut = new ResultStatut();
    error: Error = new Error();

    constructor(result: ResultStatut) {
        super();
        this.resultAction.hydrate(result.toString());
    }

    toString(): Record<string | number, any> {
        let user = this.user == null ? 'UnAuthentificated user' : `${this.user.uid}, ${this.user.email}`;

        return {
            id: this.id.toObject(),
            date: (new Date()).toISOString(),
            user,
            resultAction: this.resultAction.toString(),
            error: this.error.stack
        };
    }
}

