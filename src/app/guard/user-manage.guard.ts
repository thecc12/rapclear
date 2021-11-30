import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { NotificationService } from '../services/notification/notification.service';

@Injectable()
export class UserManageGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router,
    private notif: NotificationService) { }

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean | UrlTree> | Promise<boolean> | boolean {
      return new Promise<UrlTree | boolean>((resolve, reject) => {
        this.authService.currentUserSubject.subscribe((user) => {
          if (this.authService.userManage || this.authService.userManage) { return resolve(true); }
           this.notif.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br> You cannot access this page');
          resolve(this.router.parseUrl('/admin/list-user'));
        });
      });
    }
}
