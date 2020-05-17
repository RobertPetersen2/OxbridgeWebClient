import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';


@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  
  teams: Team[] = [];

  constructor() { }

  ngOnInit(): void {
  }


  deleteTeam(team:Team):any{
    const index : number = this.teams.indexOf(team);
    if(index !== -1){
      this.teams.splice(index, 1);
      console.log("Deleted user with message: " + team.teamName);
      return true;
    }
    return false;
  }


  editTeam(team:Team):any{
    const index: number = this.teams.indexOf(team);
    const editedValue: Team = new Team('THE  NEW TEAM 2 ');
    if(index !== -1){
      this.teams.fill(editedValue, index, index +1 );
      console.log("Edited location with message: " + team.teamName);
      return true;
    }
    return false;
  }


 // addATeam(){   // ADD A TEAM WITH HttpClient stuff...
   // const team: Team = new Team('N W A '); 
    //this.teamHttpService.addnewTeam(team).subscribe(tem => this.teams.push(tem));
  //}

}