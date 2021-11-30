import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInvestmentsListComponent } from './user-investments-list.component';

describe('UserInvestmentsListComponent', () => {
  let component: UserInvestmentsListComponent;
  let fixture: ComponentFixture<UserInvestmentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInvestmentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInvestmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
