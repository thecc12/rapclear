import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../entity/user';
import { NotificationService } from '../../../services/notification/notification.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css']
})
export class UserProfilComponent implements OnInit {
  @Input() user:User=null;
  waitForChangeStateAccount:boolean=false;
  constructor(private userService:UserService,private notifSerice:NotificationService) { }

  ngOnInit(): void {
  }
  changeAccountStatus()
  {
    this.waitForChangeStateAccount=true;
    this.userService.changeStatus(this.user)
    .then((result)=>{
     this.waitForChangeStateAccount=false;
      this.notifSerice.showNotification('top', 'center', 'success', '', `\<b>Success !\</b>\<br>Account status has been successfully updated to '${this.user.status}'`);
    })
    .catch((error)=>{
      this.waitForChangeStateAccount=false;
      this.notifSerice.showNotification('top', 'center', 'danger', 'pe-7s-close-circle', '\<b>Sorry !\</b>\<br>'+error.message);
    })
  }

}
