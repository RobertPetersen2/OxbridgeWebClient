import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { Team } from '../models/team';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamListService {


  private teamList: BehaviorSubject<Team[]>;


  constructor(private http:HttpClient) { 
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

  public deleteUserFromTeam(teamName:string, username:string){
    const deleted = this.http.post<Team[]>('http://148.251.122.228:3000/teams/participant', {teamName, username});
    deleted.subscribe(
      data => {
      let obj = JSON.parse(JSON.stringify(data));
      console.log(obj);
      if(obj.action == 'success'){
        console.log("Removing of user from team was a success");
        let teamListLocal: Team[] = this.teamList.getValue();
      }
    },
    error => {
      console.log("Error Message:" + error)
    }
    )
    return deleted;
  }

}


// import { Injectable, EventEmitter } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { User } from '../models/user';
// import { Team } from '../models/team';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class TeamListService {

//   teams: Team[] = [];

//   private availableTeams: BehaviorSubject<Team[]>;

//   constructor(private http:HttpClient) { 
//     this.teams.push(new Team("Team in teamlist.service!"));
//     this.teams.push(new Team("Team in teamlist.service2!"));
//   }

//   public getTeamList(): Observable<Team[]> { //
//     const arrayObservable = new Observable<Team[]>(observer => {
//           observer.next(this.teams);
//     });
//     return arrayObservable;
//   }

// }

