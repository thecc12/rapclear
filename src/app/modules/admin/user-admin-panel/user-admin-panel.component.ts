import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material';
import { User } from '../../../entity/user';


@Component({
  selector: 'app-user-admin-panel',
  templateUrl: './user-admin-panel.component.html',
  styleUrls: ['./user-admin-panel.component.css']
})
export class UserAdminPanelComponent implements OnInit {
 
  emailForSearchUser: string = '';
  selectedUser: User = null;
  constructor() { }

  ngOnInit(): void {
  }
  searchUser(userEmail)
  {
    this.emailForSearchUser = userEmail;
  }
  setSelectedUser(user: User)
  {
    this.selectedUser = user;
  }
  
}
