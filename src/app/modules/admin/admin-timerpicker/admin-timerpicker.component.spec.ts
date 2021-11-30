import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTimerpickerComponent } from './admin-timerpicker.component';

describe('AdminTimerpickerComponent', () => {
  let component: AdminTimerpickerComponent;
  let fixture: ComponentFixture<AdminTimerpickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTimerpickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTimerpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
