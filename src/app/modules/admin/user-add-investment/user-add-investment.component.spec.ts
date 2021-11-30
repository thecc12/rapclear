import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddInvestmentComponent } from './user-add-investments.component';

describe('UserAddInvestmentComponent', () => {
  let component: UserAddInvestmentComponent;
  let fixture: ComponentFixture<UserAddInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAddInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
