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


  public yourTeam:string;
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

  approve(username:string, team:string){
    this.enrollmentService.manageApproval(true, username, team);
  }

  reject(username:string, team:string){
    this.enrollmentService.manageApproval(false, username, team);
  }

}
