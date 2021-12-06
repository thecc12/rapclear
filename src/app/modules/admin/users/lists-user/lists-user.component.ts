import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { User } from '../../../../entity/user';
import { NotificationService } from '../../../../services/notification/notification.service';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-lists-user',
  templateUrl: './lists-user.component.html',
  styleUrls: ['./lists-user.component.scss'],
})
export class ListsUserComponent implements OnInit {
  userStatus: boolean;
  users: {waitResponse:boolean,user:User}[] = [];
  search = '';
  searchUsers: {waitResponse:boolean,user:User}[] = [];
  waitResponse:boolean=false;

  constructor(private userService: UserService,private notifService:NotificationService) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.usersSubject.subscribe((mapUser:Map<string,User>)=>{
      this.users = Array.from(mapUser.values()).map((user)=>{
        return {waitResponse:false,user}
      })
      this.searchUser();
    })
  }

  changeStatus(user) {
    user.waitResponse=true;
    this.userService.changeStatus(user.user)
    .then((result)=>{
      user.waitResponse=false;
      this.notifService.showNotification('top', 'center', 'success', '', `\<b>Success !\</b>\<br>Account status has been successfully updated to '${user.user.status}'`);
    })
    .catch((error)=>{
      user.waitResponse=false;
      this.notifService.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
    })
  }

  searchUser() {
    this.searchUsers =
      _.filter(this.users, (user) => _.includes(user.user.email, this.search) || _.includes(user.user.name, this.search) || _.includes(user.user.phone, this.search))
  }

  deleteUser(id) {
  }
}
