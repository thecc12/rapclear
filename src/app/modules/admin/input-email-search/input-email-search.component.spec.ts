import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputEmailSearchComponent } from './input-email-search.component';

describe('InputEmailSearchComponent', () => {
  let component: InputEmailSearchComponent;
  let fixture: ComponentFixture<InputEmailSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputEmailSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputEmailSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
