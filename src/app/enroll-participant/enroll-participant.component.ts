import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-enroll-participant',
  templateUrl: './enroll-participant.component.html',
  styleUrls: ['./enroll-participant.component.css']
})
export class EnrollParticipantComponent implements OnInit {

  public infoText:string;
  public selectedTeam:Team;

  constructor() { 
    this.infoText = "It doesn't look like you have any teams :(";
  }

  teams: Team[] = [
    {teamName: 'HardCodedTeam1'},
    {teamName: 'HardCodedTeam2'},
    {teamName: 'HardCodedTeam3'}
  ];


  ngOnInit(): void {
  }

}
