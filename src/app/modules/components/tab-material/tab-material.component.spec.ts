import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMaterialComponent } from './tab-material.component';

describe('TabMaterialComponent', () => {
  let component: TabMaterialComponent;
  let fixture: ComponentFixture<TabMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
