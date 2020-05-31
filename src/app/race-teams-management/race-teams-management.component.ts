import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';

@Component({
  selector: 'app-race-teams-management',
  templateUrl: './race-teams-management.component.html',
  styleUrls: ['./race-teams-management.component.css']
})
export class RaceTeamsManagementComponent implements OnInit {


  public availableTeams:Team[];
  public selectedTeam: string;

  constructor() { }

  ngOnInit(): void {
    this.availableTeams = [
      {teamName:"Lort"},
      {teamName:"Endnu mere lort"},
      {teamName:"Kartoffel"},
      {teamName:"Røvbanan"}
    ]
  }

  click(team: string): void {
    this.selectedTeam = team;
  }

}
