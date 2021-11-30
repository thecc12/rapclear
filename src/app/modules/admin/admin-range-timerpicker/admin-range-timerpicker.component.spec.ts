import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRangeTimerpickerComponent } from './admin-range-timerpicker.component';

describe('AdminRangeTimerpickerComponent', () => {
  let component: AdminRangeTimerpickerComponent;
  let fixture: ComponentFixture<AdminRangeTimerpickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRangeTimerpickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRangeTimerpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
