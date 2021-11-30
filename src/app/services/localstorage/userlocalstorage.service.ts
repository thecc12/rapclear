import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, ResolveEnd, Router, } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../entity/user';

export interface UserLocalStorageData
{
  isLoggedIn: boolean,
  user: User
}

@Injectable({
  providedIn: 'root'
})
export class UserlocalstorageService {
  dataUser: BehaviorSubject<UserLocalStorageData> = new BehaviorSubject<UserLocalStorageData>({isLoggedIn: false, user: new User()});
  constructor(private router: Router) {
    this.getUserDataWhenNavStart();
   }

  getUserDataWhenNavStart()
  {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        if (localStorage.getItem('isLoggedIn') && localStorage.getItem('user'))
        {
          let isLogged: Boolean = JSON.parse(localStorage.getItem('isLoggedIn'));
          if (isLogged)
          {
            let user: User = new User();
            user.hydrate(JSON.parse(localStorage.getItem('user')))
            this.dataUser.next({
              isLoggedIn: true,
              user
            });
          }
        }
      }
    });
  }
  setUserData(data: UserLocalStorageData) {
    localStorage.setItem('isLoggedIn', JSON.stringify(data.isLoggedIn));
    localStorage.setItem('user', JSON.stringify(data.user.toString()));
    this.dataUser.next(data);
  }
  clearData() {
    localStorage.clear();
    this.dataUser.next({isLoggedIn: false, user: new User()});
  }
}
