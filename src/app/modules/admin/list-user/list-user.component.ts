import { SelectionModel } from '@angular/cdk/collections';
import { AfterContentInit, AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { User } from '../../../entity/user';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit, OnChanges {

  loadingData: boolean = true;
  isInit = true;
  users: User[] = [];
  @Input() emailUser: string;
  emailUserObservable: BehaviorSubject<string> = new BehaviorSubject<string>('');
  @Output() selectedUser: EventEmitter<User> = new EventEmitter<User>();

  @ViewChild(MatSelectionList, {static: true}) private selectionList: MatSelectionList;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
    combineLatest([this.userService.usersSubject, this.emailUserObservable])
    .subscribe(([userList, email]) => {
      if (userList.size == 0) { return; }
      if (email == '') {
        this.loadingData = false;
        this.users = Array.from(userList.values());
        return;
      }
      this.users = Array.from(userList.values())
      .filter((user: User) => user.email.startsWith(email));
    });
    this.selectionList.selectionChange.subscribe((change) => {
      // tslint:disable-next-line:max-line-length
      if (this.selectionList.selectedOptions.selected.length > 0) {
        this.selectedUser.emit(this.selectionList.selectedOptions.selected[0].value);
      } else { this.selectedUser.emit(null); }

    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.emailUser) { this.emailUserObservable.next(changes.emailUser.currentValue); }
  }

}
