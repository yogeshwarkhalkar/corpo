import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingLogComponent } from './meeting-log.component';

describe('MeetingLogComponent', () => {
  let component: MeetingLogComponent;
  let fixture: ComponentFixture<MeetingLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
