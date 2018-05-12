import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingCompanyComponent } from './existing-company.component';

describe('ExistingCompanyComponent', () => {
  let component: ExistingCompanyComponent;
  let fixture: ComponentFixture<ExistingCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
