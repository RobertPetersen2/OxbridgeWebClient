import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { EnrollmentStatus } from './enrollment-status.enum';


@Component({
  selector: 'app-enroll-participant',
  templateUrl: './enroll-participant.component.html',
  styleUrls: ['./enroll-participant.component.css']
})


export class EnrollParticipantComponent implements OnInit {

  // Only used for selecting a team in the dropdown menu
  public selectedTeam:string;
  // Used when user HAS a team. This property must be loaded from the server
  public yourTeam:string;

  // 3 possible states (imported class)
  public States = EnrollmentStatus;

  // Users own status (currntly only used for testing): <--- 3 different swithces
  public userEnrollmentStatus:EnrollmentStatus;



  constructor() { 
    this.selectedTeam = "No team selected";
    this.yourTeam = "Test Team";

    this.userEnrollmentStatus = EnrollmentStatus.NoTeam; //<--- Right here it should retrieve information from the server


  }




  teams: Team[] = [
    {teamName: 'HardCodedTeam1'},
    {teamName: 'HardCodedTeam2'},
    {teamName: 'HardCodedTeam3'}
  ];


  ngOnInit(): void {
  }
  

  click(team:string): void {
    this.selectedTeam = team;
  }

}




