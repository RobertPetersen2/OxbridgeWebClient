import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { EnrollmentStatus } from './enrollment-status.enum';
import { EnrollmentService } from '../service/enrollment.service';
import { AuthenticationService } from '../service/authentication.service';


@Component({
  selector: 'app-enroll-participant',
  templateUrl: './enroll-participant.component.html',
  styleUrls: ['./enroll-participant.component.css']
})


export class EnrollParticipantComponent implements OnInit {

  // Only used for selecting a team in the dropdown menu
  public selectedTeam: string;
  // Used when user HAS a team. This property must be loaded from the server
  public yourTeam: string;

  // 3 possible states (imported class)
  public States = EnrollmentStatus;

  // Users own status (currntly only used for testing): <--- 3 different swithces
  public userEnrollmentStatus: EnrollmentStatus;

  // List of teams the user can apply for
  teams: Team[] = [];

  constructor(
    private enrollmentService: EnrollmentService,
    private authenticationService: AuthenticationService) {
    this.selectedTeam = "No team selected";
    this.yourTeam = "Test Team";
    this.userEnrollmentStatus = EnrollmentStatus.Undefined; //<--- Right here it should retrieve information from the server

    // Get the enrollment status of the current user
    const currentEnrollmentStatus = this.enrollmentService.getStatus();
    currentEnrollmentStatus.subscribe((enrollmentEnum: EnrollmentStatus) => {
      this.userEnrollmentStatus = enrollmentEnum;
    });


    // Get a list of available teams
    const availableTeams = this.enrollmentService.getAvailableTeams();
    availableTeams.subscribe((availableTeamsData: Team[]) => {
      this.teams = availableTeamsData;
    });

    // If enrollment status was changed we need to reload the page
    enrollmentService.newDataAdded.subscribe(
      (st: string) => {
        console.log(st);
        window.location.reload();
      }
    );
    
    // Get the team name of the user logged in
    enrollmentService.getYourTeam().subscribe(
      (teamNameData:string) => {
        this.yourTeam = teamNameData;
      }
    )

  }

  ngOnInit(): void {
  }

  /**
   * This method is used if the user isn't assigned to a Team, and he wants to apply for one he selected
   */
  submit() {
    let currentUser = this.authenticationService.currentUserValue;
    console.log("Sending: ")
    console.log(currentUser.username + " and " + this.selectedTeam);
    this.enrollmentService.applyForTeam(currentUser.username, this.selectedTeam);
    
  }

  /**
   * Used for displaying the team, which the user clicked on from the dropdown menu
   * @param team 
   */
  click(team: string): void {
    this.selectedTeam = team;
  }

  /**
   * This method is used if the user has already joined a team, but wants to leave it
   */
  leaveTeam(){
    let currentUser = this.authenticationService.currentUserValue;
    this.enrollmentService.leaveTeam(currentUser.username);
  }

}




