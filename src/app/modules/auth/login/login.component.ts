import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../entity/user';
import { AuthService } from '../../../services/auth/auth.service';
import { ResultStatut } from '../../../services/firebase/resultstatut';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';
// import { AuthService } from '../../../services/auth/auth.service';
// import { ResultStatut } from '../../../services/firebase/resultstatut';
// import { NotificationService } from '../../../services/notification/notification.service';
// import { UserService } from '../../../services/user/user.service';
import { ValidatorinputService } from '../../../services/validatorinput/validatorinput.service';

// interface UserLocalStorageData {
//   email: string;
//   password: string;
//   name: string;
//   fullName: string;
//   nicNumber: string;
//   emailVerified: string;
//   phone: string;
//   country: string;
//   city: string;
//   mySponsorShipId: string;
//   parentSponsorShipId: string;
//   status: string;
//   photoUrl: string;
//   network: string;
//   user_agree: string;
//   bonus: string;
//   dateCreation: string;
// }

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  submitted: boolean = false;
  loginForm: FormGroup;
  waitingLogin: boolean = false;
  name: string = '';
  email: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private sanitezeService: ValidatorinputService,
    // private authen: AuthService,
    private formLog: FormBuilder,
    private userData: UserService,
    private notification: NotificationService) {
  }

  ngOnInit(): void {
    this.loginForm = this.formLog.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(6)]]
    });
    this.waitingLogin = false;
  }

  get f() {
    return this.loginForm.controls;
  }

  navigateToRegister() {
    this.router.navigate(['/registration']);
  }

  navigateToForgot() {
    this.router.navigate(['/forgot-password']);
  }

  submit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.waitingLogin = true;
    let user: User = new User();
    user.email = this.sanitezeService.emailSanitize(this.loginForm.value.email);
    user.password = this.loginForm.value.password;

    this.authService.signIn(user)
      .then((result) => {
        this.router.navigate(['user/dashboard']);
        this.setLocalstorageCurentUser();
        // tslint:disable-next-line:max-line-length
        this.notification.showNotification('top', 'center', 'success', 'pe-7s-close-circle', '\<b>Welcome !\</b>\<br>' + localStorage.getItem('name'));
        this.submitted = false;
        this.waitingLogin = false;
      })
      .catch((error: ResultStatut) => {
        this.waitingLogin = false;
        // tslint:disable-next-line:max-line-length
        this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);
        this.submitted = false;

      });
  }

  setLocalstorageCurentUser() {
    this.authService.currentUserSubject.subscribe((user: User) => {
      localStorage.setItem('userId', user.id.toString().toString());
      localStorage.setItem('name', user.fullName);
      localStorage.setItem('email', user.email);
      localStorage.setItem('emailVerified', user.emailVerified.toString());
      localStorage.setItem('phone', user.phone);
      localStorage.setItem('country', this.authService.currentUserSubject.getValue().country);
      localStorage.setItem('city', this.authService.currentUserSubject.getValue().city);
      localStorage.setItem('mySponsorShipId', user.mySponsorShipId.toString().toString());
      localStorage.setItem('parentSponsorShipId', this.authService.currentUserSubject.getValue().parentSponsorShipId.toString().toString());
      localStorage.setItem('dateCreation', user.dateCreation);
      localStorage.setItem('status', user.status);
      localStorage.setItem('network', user.network);
      localStorage.setItem('bonus', user.bonus.toString());
    });
  }
}
