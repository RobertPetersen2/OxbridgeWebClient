import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { TeamListService} from '../service/team-list.service';
import { AuthenticationService } from '../service/authentication.service';


@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  
  public teamList: Team[] = [];
  public teamMembers: string;

  constructor(
    private teamListService : TeamListService,
    private authenticationService: AuthenticationService
    ) { 

    // Get a list of all teams as Admin
    const adminTeamList = this.teamListService.getTeamList();
    adminTeamList.subscribe((adminTeamListData: Team[]) => {
      this.teamList = adminTeamListData;
    });


  }

  editTeam(team:Team):any{
    const index: number = this.teamList.indexOf(team);
    console.log("Editing team: " + team.teamName);
    this.teamMembers = team.users;
    console.log(this.teamMembers);
  }

  deleteUser(team:Team):any{
    const index: number = this.teamList.indexOf(team);
    console.log("You are trying to delete user: " + team.users);
  }
  


  ngOnInit(): void {
  //   const reservationsObservable = this.teamListAdmin.getTeamList();
  //   reservationsObservable.subscribe((locationData: Team[]) => {
  //     this.teams = locationData;
  // })
  }
  



  // deleteTeam(team:Team):any{
  //   const index : number = this.teams.indexOf(team);
  //   if(index !== -1){
  //     this.teams.splice(index, 1);
  //     console.log("Deleted user with message: " + team.teamName);
  //     return true;
  //   }
  //   return false;
  // }


  // editTeam(team:Team):any{
  //   const index: number = this.teams.indexOf(team);
  //   const editedValue: Team = new Team('THE  NEW TEAM 2 ');
  //   if(index !== -1){
  //     this.teams.fill(editedValue, index, index +1 );
  //     console.log("Edited location with message: " + team.teamName);
  //     return true;
  //   }
  //   return false;
  // }


 // addATeam(){   // ADD A TEAM WITH HttpClient stuff...
   // const team: Team = new Team('N W A '); 
    //this.teamHttpService.addnewTeam(team).subscribe(tem => this.teams.push(tem));
  //}

}