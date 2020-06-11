import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { PendingUser } from '../models/pending-user';
import { EnrollmentService } from '../service/enrollment.service';

@Component({
  selector: 'app-team-member-pending-approvals',
  templateUrl: './team-member-pending-approvals.component.html',
  styleUrls: ['./team-member-pending-approvals.component.css']
})
export class TeamMemberPendingApprovalsComponent implements OnInit {

  // The Team Leaders team
  public yourTeam:string;
  // A list of people who are trying to join the Team Leaders team
  public pendingApprovals:PendingUser[];

  constructor(private authenticationService:AuthenticationService,
    private enrollmentService:EnrollmentService) {
      let currentUser = this.authenticationService.currentUserValue;
      this.yourTeam = currentUser.team;

      this.enrollmentService.getPendingApprovals().subscribe((data: PendingUser[]) => {
        this.pendingApprovals = data;
      });

      
   }

  ngOnInit(): void {
  }

  /**
   * Accept the application
   * @param username username of the applicant 
   * @param team team he is trying to join (team leaders team)
   */
  approve(username:string, team:string){
    this.enrollmentService.manageApproval(true, username, team);
  }

  /**
   * Reject the application
   * @param username username of the applicant 
   * @param team team he is trying to join (team leaders team)
   */
  reject(username:string, team:string){
    this.enrollmentService.manageApproval(false, username, team);
  }

}
