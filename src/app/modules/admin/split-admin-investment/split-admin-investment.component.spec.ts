import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitAdminInvestmentComponent } from './split-admin-investment.investment';

describe('SplitAdminInvestmentComponent', () => {
  let component: SplitAdminInvestmentComponent;
  let fixture: ComponentFixture<SplitAdminInvestmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitAdminInvestmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitAdminInvestmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
