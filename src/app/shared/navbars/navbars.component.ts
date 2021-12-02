import { AfterViewChecked, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Message } from '../../entity/chat';
import { Investment } from '../../entity/investment';
import { User } from '../../entity/user';
import { AuthService } from '../../services/auth/auth.service';
import { FirebaseApi } from '../../services/firebase/FirebaseApi';
import { BasicInvestmentService } from '../../services/investment/basic-investment.service';
import { NotificationService } from '../../services/notification/notification.service';
import { UserNotificationService } from '../../services/user-notification/user-notification.service';
import { UserService } from '../../services/user/user.service';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-navbars',
  templateUrl: './navbars.component.html',
  styleUrls: ['./navbars.component.css']
})
export class NavbarsComponent implements OnInit, AfterViewChecked {
  // userName: string = localStorage.getItem('name');
  @ViewChild('confirmPayment') public confirmPayment: ModalDirective;

  public sidebarMinimized = false;
  public navItems = navItems;
  waitResponse = false;
  selectedInvestment: Investment = new Investment();
  selectedUser: User = new User();
  selectedMessage: Message = new Message();
  errorFindingInvestmentageMessage = '';
  unreadMessageList: { pack: Investment, message: Message }[] = [];
  public userName: String = '';
  closeResult = '';
  notif: boolean;
  // To have a current year for copirygth
  year: Date = new Date();
  fullName: string = '';
  isAdmin: boolean = false;
  isManager: boolean = false;
  defaultLang = "";

  todayTime: number = Date.now();

  private _isCollapsed: boolean = true;
  set isCollapsed(value) {
    this._isCollapsed = value;
  }
  get isCollapsed() {
    if (this.collapseRef) {
      // temp fix for "overflow: hidden"
      if (getComputedStyle(this.collapseRef.nativeElement).getPropertyValue('display') === 'flex') {
        this.renderer.removeStyle(this.collapseRef.nativeElement, 'overflow');
      }
    }
    return this._isCollapsed;
  }

  @ViewChild(CollapseDirective, { read: ElementRef, static: false }) collapse !: CollapseDirective;

  collapseRef;


  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router,
    private bsModal: BsModalService,
    private dashbaord: ElementRef,
    private userService: UserService,
    private userNotif: UserNotificationService,
    private firebaseApi: FirebaseApi,
    private notification: NotificationService,
    private packService: BasicInvestmentService) {
    this.isAdmin = this.authService.isAdminer;
    this.fullName = this.authService.currentUserSubject.getValue().fullName;
    if (this.authService.currentUserSubject.getValue().email == 'admin@admin.com') {
      this.isAdmin = true;
    } else if (localStorage.getItem('email') == 'admin@admin.com') {
      this.isAdmin = true;
    } else if (this.authService.currentUserSubject.getValue().email == 'pundayusufu619@gmail.com') {
      this.isManager = true;
    } else {
      this.isManager = false;
    }
  }
  // this.myfunc();}

  logOut() {
    this.authService.signOut();
  }

  ngOnInit() {
    this.fullName = this.authService.currentUserSubject.getValue().fullName;
    this.authService.currentUserSubject.subscribe((user: User) => {
      if (!user) { return this.userName = user.name; }
    });

    this.firebaseApi.handleConnexionState((state: { connected: boolean }) => {
      if (state.connected) {
        this.notification.showNotification('top', 'right', 'success', 'pe-7s-close-circle', '\<b>Internet connection established !\</b>');
      } else {
        this.notification.showNotification('top', 'right', 'warning', 'pe-7s-close-circle', '\<b>Internet connection lost !\</b>');
      }
    });

  }

  ngAfterViewChecked(): void {
    this.collapseRef = this.collapse;
  }
}
