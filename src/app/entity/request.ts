import { Entity } from './entity';

export enum RequestState {
    ON_WAITIN = 'on_waiting',
    VALIDED = 'valided',
    REJECTED = 'rejected',
    ARCHIVED = 'archived',
}

export class Request extends Entity {
    ownerId: string = ''; // id du user qui soumet la requette
    object: string = ''; // Motif de la requete
    content: string = ''; // contenu textuel de la requette
    // tslint:disable-next-line:max-line-length
    status: RequestState = RequestState.ON_WAITIN; // statu de la requette ( ON_WAITIN lorsque le user soumet, VALIDED lorsque vérifié et approuvé par l'admin, REJECTED lorsque vérifié et refusé par l'admin )
    photoUrl: string = ''; // lien vers Image de capture

}
