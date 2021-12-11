import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    refresh: number = 1;
    showNotification(from, align, colortype, icon, text, time?: number) {
        if (!time) {
            time = 3000;
        }
        $.notify({
            icon: icon,
            message: text
        }, {
            type: colortype,
            timer: time,
            placement: {
                from: from,
                align: align
            }
        });
    }

    refreshFonct() {
            window.location.reload();
    }
}
