import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceTeamsManagementComponent } from './race-teams-management.component';

describe('RaceTeamsManagementComponent', () => {
  let component: RaceTeamsManagementComponent;
  let fixture: ComponentFixture<RaceTeamsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceTeamsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceTeamsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
