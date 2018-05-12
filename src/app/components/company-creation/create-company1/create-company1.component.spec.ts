import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompany1Component } from './create-company1.component';

describe('CreateCompany1Component', () => {
  let component: CreateCompany1Component;
  let fixture: ComponentFixture<CreateCompany1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompany1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompany1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
