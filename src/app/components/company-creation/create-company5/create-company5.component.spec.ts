import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompany5Component } from './create-company5.component';

describe('CreateCompany5Component', () => {
  let component: CreateCompany5Component;
  let fixture: ComponentFixture<CreateCompany5Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompany5Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompany5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
