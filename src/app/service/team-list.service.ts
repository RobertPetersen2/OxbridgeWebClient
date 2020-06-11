import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { Team } from '../models/team';
import { HttpClient } from '@angular/common/http';
import { TeamMember } from '../models/team-member';

@Injectable({
  providedIn: 'root'
})
export class TeamListService {


  private teamList: BehaviorSubject<Team[]>;
  private teamNameTL: string;
  


  constructor(private http:HttpClient) { 

  //  this.teams.push(new Team("Team in teamlist.service!"));

    this.teamList = new BehaviorSubject<Team[]>([]);

  }


  public getTeamList(): Observable<Team[]> {
    // Load the Teams from the DB can both be used for Admin and Teamleader
    const teamObj = this.http.get<Team[]>('http://148.251.122.228:3000/teams/');
    // If this method is called again we update the observable
    teamObj.subscribe((response: Team[]) => {
      console.log(response);
      this.teamList.next(response);
    });
    return this.teamList;
  }


  // TL Part
  public getTeamMember(): Observable<Team[]> {
    const teamList = this.http.get<Team[]>('http://148.251.122.228:3000/teams/');
    teamList.subscribe((response: Team[]) => {
      //console.log(response);
      this.teamList.next(response);

    });
    return this.teamList;
  }
  


  public deleteUserFromTeam(teamName:string, username:string): void {
    const deleted = this.http.post<Team[]>('http://148.251.122.228:3000/teams/participant', {teamName, username});
    deleted.subscribe(
      data => {
      let obj = JSON.parse(JSON.stringify(data));
      console.log(obj);
      if(obj.action == 'success'){
        console.log("Removing of user from team was a success");
        this.removeMemberFromTeam(teamName, username);
      }
    },
    error => {
      console.log("Error Message:" + error)
    }
    )
  }

  public deleteTeam(teamName:string): void {
    const deleted = this.http.post<Team[]>('http://148.251.122.228:3000/teams/deleteTeam', {teamName});
    deleted.subscribe(
      data => {
      let obj = JSON.parse(JSON.stringify(data));
      console.log(obj);
      if(obj.hasOwnProperty('action')){
        if(obj.action == 'success'){
          console.log("Removing team entirely");
          // Lets update the team list
          let teamListLocal: Team[] = this.teamList.value;
          console.log("The local team list is: " + JSON.stringify(teamListLocal));
          let teamObj: Team = teamListLocal.find(x => x.teamName === teamName);
          console.log("You are trying to delete: " + teamObj.teamName);
          const index = teamListLocal.indexOf(teamObj);
          console.log("The index of this is: " + index);
          if(index!==-1){
            // Now that we have it, we simply need to remove it
            teamListLocal.splice(index,1);
            // Set the observable to the updated team after removal
            this.teamList.next(teamListLocal);
          } else {
            return;
          }
        }
      }
    },
    error => {
      console.log("Error Message:" + error)
    }
    )
  }

  private removeMemberFromTeam(teamName:string, teamMember:string) : any {
    // We create a temporary variable of the teams observable
    let teamListLocal: Team[] = this.teamList.getValue();
    // We find the object in our array with this ID
    let teamObj: Team = teamListLocal.find(x => x.teamName === teamName);
    // Now that we have the team object itself we also want to extract the users array 
    let usersArray: TeamMember[] = teamObj.users;
    // Next is to find the user in the array, that we want to delete
    let memberToDelete = usersArray.find(x => x.username === teamMember);
    // We want to know where in the usersArray he is
    const index: number = usersArray.indexOf(memberToDelete);
    console.log("This user you are trying to delete is located at index: " + index);
    if(index!==-1){
      // Now that we have it, we simply need to remove it
      usersArray.splice(index,1);
      // The user should be removed now. Lets replace the list of users in the entire team list
      teamObj.users = usersArray;
      // Now we also wanna replace the old entry in the team list
      const indexOfTeam = teamListLocal.indexOf(teamObj);
      if(indexOfTeam!==-1){
        // We insert the team object in the index where it was before
        teamListLocal[indexOfTeam] = teamObj;
        console.log("Team object was updated with new values");
        this.teamList.next(teamListLocal);
      }
    } else {
      return;
    }
  }

}


