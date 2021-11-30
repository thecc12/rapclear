import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GainInputComponent } from './gain-input.component';

describe('GainInputComponent', () => {
  let component: GainInputComponent;
  let fixture: ComponentFixture<GainInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GainInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GainInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
