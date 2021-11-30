import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsPanelComponent } from './investments-panel.component';

describe('InvestmentsPanelComponent', () => {
  let component: InvestmentsPanelComponent;
  let fixture: ComponentFixture<InvestmentsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
