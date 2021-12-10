import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SponsorID } from '../../../entity/sponsorid';
import { User } from '../../../entity/user';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../services/auth/auth.service';
// import { NotificationService } from '../../../services/notification/notification.service';
import { SponsorService } from '../../../services/sponsor/sponsor.service';
import { UserService } from '../../../services/user/user.service';
import { ValidatorinputService } from '../../../services/validatorinput/validatorinput.service';
// import { UserService } from '../../../services/user/user.service';
// import { ValidatorinputService } from '../../../services/validatorinput/validatorinput.service';
import { MustMatch } from '../../../services/_helpers/must-match.validator';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  public static currentUser: User = new User();
  submitted: boolean = false;
  registerForm: FormGroup;
  registrationMessage: String = '';
  waitingRegistration: boolean = false;
  messageColor: String = '';
  user: any;
  sponsorId: string;
  i = 0; // my variable to condition the number of execution of the submit at 01 time

  constructor(
    private authService: AuthService, // firebase auth
    private sanitizeService: ValidatorinputService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private formLog: FormBuilder,
    private sponsort: SponsorService,
    private notification: NotificationService
  ) {
    this.getSponsorId();
  }

  ngOnInit(): void {
    this.sponsorId = localStorage.getItem('referal');
    this.registerForm = this.formBuilder.group({
      'fullName': new FormControl('', [Validators.required]),
      'user_agree': new FormControl(false, [Validators.requiredTrue]),
      'country': new FormControl('', [Validators.required]),
      'city': new FormControl('', [Validators.required]),
      'network': new FormControl('', [Validators.required]),
      'sponsorshipId': new FormControl(''),
      'phone': new FormControl('', [Validators.minLength(9), Validators.maxLength(9), Validators.pattern('^6[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{2}$')]),
      'password': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'password2': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required, Validators.email]),

    }, {
      validator: MustMatch('password', 'password2')
    });
  }

  setFormData(): User {

      let user: User = new User();
      user.hydrate(this.registerForm.value)
      // user.fullName = this.registerForm.value.name;
      user.email = this.sanitizeService.emailSanitize(this.registerForm.value.email);
      // user.password = this.registerForm.value.password;
      // user.country = this.registerForm.value.country;
      // user.city = this.registerForm.value.city;
      // user.phone = `${this.registerForm.value.phone}`;
      user.mySponsorShipId.setId(SponsorID.generateId(user).toString());
      if (this.sponsorId) { user.parentSponsorShipId.setId(this.sponsorId); }
      user.network = this.registerForm.value.network;
      user.user_agree = true;
      // console.log("user ",user)
      return user;
  }


  onSubmit() {
    this.submitted = true;
    this.registerForm.value.sponsorshipId = this.sponsorId;
    // console.log('referral: ', this.sponsorId);
    // console.log('Reg form avant setform', this.registerForm);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.waitingRegistration = true;
    let user: User = this.setFormData();
    // console.log('data de setForm', user);
    this.authService.signInNewUser(user)
      .then((result) => {
        this.router.navigate(['auth/login']);
        // tslint:disable-next-line:max-line-length
        this.notification.showNotification('top', 'center', 'success', '', '\<b>Success !\</b>\<br>Account created successfully! <br>Sign In to start your first investment', 5000);
        this.waitingRegistration = false;
        this.submitted = false;

      })
      .catch((error) => {
        this.waitingRegistration = false;
        console.log("Error ",error);
        // tslint:disable-next-line:max-line-length
        this.notification.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>' + error.message);
        this.submitted = false;
      });

  }

  get f() {
      return this.registerForm.controls;
  }

  navigateToLogin() {
      this.router.navigate(['login']);
  }

  navigateToVerifyEmail() {
      this.router.navigate(['verify-email-address']);
  }

  /////

  getSponsorId() {
      this.sponsorId = this.sponsort.getSponsorId();
      return this.sponsort.getSponsorId();
  }
}
