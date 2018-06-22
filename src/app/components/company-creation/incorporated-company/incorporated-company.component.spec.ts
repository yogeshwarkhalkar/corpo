import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncorporatedCompanyComponent } from './incorporated-company.component';

describe('IncorporatedCompanyComponent', () => {
  let component: IncorporatedCompanyComponent;
  let fixture: ComponentFixture<IncorporatedCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncorporatedCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncorporatedCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
