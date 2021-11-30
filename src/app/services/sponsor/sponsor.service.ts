
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SponsorService {
    haveRef: boolean = false;
    
    constructor(
        private router: Router) {
    }

    getSponsorId() {
        let href = this.router.url;
        let tab = href.split('/');
        if (tab[3]) {
            this.haveRef = true;
            localStorage.setItem('referal', tab[3]);
            console.log('tab: ', tab[3]);
            return tab[3];
        } else {
            // localStorage.setItem('referal', 'Referal: Automatic completion');
            return tab[3];
        }
    }
}
