import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransferPackComponent } from './user-transfer-investment.component';

describe('UserTransferPackComponent', () => {
  let component: UserTransferPackComponent;
  let fixture: ComponentFixture<UserTransferPackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTransferPackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTransferPackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
