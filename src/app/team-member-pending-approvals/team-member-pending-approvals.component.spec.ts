import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberPendingApprovalsComponent } from './team-member-pending-approvals.component';

describe('TeamMemberPendingApprovalsComponent', () => {
  let component: TeamMemberPendingApprovalsComponent;
  let fixture: ComponentFixture<TeamMemberPendingApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberPendingApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberPendingApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
