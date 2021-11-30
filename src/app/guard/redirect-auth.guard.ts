import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../entity/user';
import { AuthService } from '../service/auth/auth.service';
// import { AuthService } from '../service/auth/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return true;
  }
}
