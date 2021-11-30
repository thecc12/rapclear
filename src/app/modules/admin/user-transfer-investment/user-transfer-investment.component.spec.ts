import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransferInvestmentComponent } from './user-transfer-investment.component';

describe('UserTransferInvestmentComponent', () => {
  let component: UserTransferInvestmentComponent;
  let fixture: ComponentFixture<UserTransferInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTransferInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTransferInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
