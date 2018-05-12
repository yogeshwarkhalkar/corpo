import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompany3Component } from './create-company3.component';

describe('CreateCompany3Component', () => {
  let component: CreateCompany3Component;
  let fixture: ComponentFixture<CreateCompany3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCompany3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompany3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
