import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsAdminActionComponent } from './investments-admin-action.component';

describe('InvestmentsAdminActionComponent', () => {
  let component: InvestmentsAdminActionComponent;
  let fixture: ComponentFixture<InvestmentsAdminActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsAdminActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsAdminActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
