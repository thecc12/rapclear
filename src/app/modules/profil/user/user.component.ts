import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import { User } from '../../../entity/user';
import { AuthService } from '../../../services/auth/auth.service';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  updateProfilForm: FormGroup;
  user: User = new User();
  name: string = '';
  email: string = '';
  network: string = '';
  phone: string = '';
  bonus: number = 0;
  country: string = '';
  city: string = '';
  message: string = '\<b>Error\</b>\<br>this action not permited!';
  id: string = '';
  mySponsorShipId: string = '';
  dateCreation: string;
  parentSponsorShipId: string = '';

  constructor(
    private authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    public notif: NotificationService) {
      this.getData();
  // console.log('parent sponsor id', this.parentSponsorShipId)

  }

  copyMessage(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    // selBox.value = 'localhost:4200/#/auth/register/' + val; // a remplacer par le lien https de la page registration de TCC
    selBox.value = 'https://app-the-crypto-currency.000webhostapp.com/#/auth/register/' + val; // a remplacer par le lien https de la page registration de TCC
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnInit() {
    this.getData();
  }

  // setData() {
  //   this.authService.currentUserSubject.subscribe((user: User) => {
  //     this.name = user.fullName;
  //     this.email = user.email;
  //     this.network = user.network;
  //     this.phone = user.phone;
  //     this.dateCreation = user.dateCreation;
  //     this.id = user.mySponsorShipId.toString().toString();
  //     this.country = this.authService.currentUserSubject.getValue().country;
  //     this.city = this.authService.currentUserSubject.getValue().city;
  //     this.parentSponsorShipId = this.authService.currentUserSubject.getValue().parentSponsorShipId.toString().toString();
  //   });
  // }

  getData() {
      this.name = localStorage.getItem('name');
      this.email = localStorage.getItem('email');
      this.network = localStorage.getItem('network');
      this.phone = localStorage.getItem('phone');
      this.dateCreation = localStorage.getItem('dateCreation');
      this.id = localStorage.getItem('userId');
      this.country = localStorage.getItem('country');
      this.city = localStorage.getItem('city');
      this.mySponsorShipId = localStorage.getItem('mySponsorShipId');
      this.parentSponsorShipId = localStorage.getItem('parentSponsorShipId');
  }

  idCopied() {
    this.notif.showNotification('top', 'center', 'success', 'fa fa-check', '  Referral copied');

  }
}
