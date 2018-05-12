import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompany4Component } from './create-company4.component';

describe('CreateCompany4Component', () => {
  let component: CreateCompany4Component;
  let fixture: ComponentFixture<CreateCompany4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompany4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompany4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
