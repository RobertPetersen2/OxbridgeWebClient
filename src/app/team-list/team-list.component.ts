import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { TeamListService} from '../service/team-list.service';
import { AuthenticationService } from '../service/authentication.service';
import { TEMPORARY_NAME } from '@angular/compiler/src/render3/view/util';
import { first } from 'rxjs/operators';
import { TeamMember } from '../models/team-member';



@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {
  
  public teamList: Team[] = [];
  public teamMembers: TeamMember[];
  public currentlyEditing: string;

  constructor(
    private teamListService : TeamListService,
    private authenticationService: AuthenticationService
    ) { 

    let currentUser = this.authenticationService.currentUserValue;

    // Get a list of all teams

    // Working part for admin
    if(currentUser.isAdmin === true){
      const teamList = this.teamListService.getTeamList();
      teamList.subscribe((teamListData: Team[]) => {
      this.teamList = teamListData;
    });
    }

    // Teamleader has to be fixed
    if(currentUser.isTeamLeader === true){
      const teamList = this.teamListService.getTeamList();
      teamList.subscribe((teamListData: Team[]) => {
      this.teamList = teamListData;
    });
    }

  }

  
  editTeam(team:Team):any{
    const index: number = this.teamList.indexOf(team);
    console.log("Editing team: " + team.teamName);
    this.teamMembers = team.users;
    console.log(this.teamMembers);
    this.currentlyEditing = team.teamName
  }

  deleteUser(user: string){
    console.log("You are trying to delete user from team: " + this.currentlyEditing + user);
    // We delete the user from the team, which should automatically update the teamlist that we are subscribing to
    // So no further action should be required
    this.teamListService.deleteUserFromTeam(this.currentlyEditing, user);
    // If you are deleting yourself, you should be logged out
    if(user == this.authenticationService.currentUserValue.username){
      this.authenticationService.logout();
    }
    
  }
  
  deleteTeam(teamName:string){
    this.teamListService.deleteTeam(teamName);
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