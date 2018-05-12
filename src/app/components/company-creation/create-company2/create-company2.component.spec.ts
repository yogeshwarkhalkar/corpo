import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompany2Component } from './create-company2.component';

describe('CreateCompany2Component', () => {
  let component: CreateCompany2Component;
  let fixture: ComponentFixture<CreateCompany2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompany2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompany2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
