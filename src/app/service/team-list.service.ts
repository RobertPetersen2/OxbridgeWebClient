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
    // Load the races from the DB
    const teamObj = this.http.get<Team[]>('http://148.251.122.228:3000/teams/');
    // If this method is called again we update the observable
    teamObj.subscribe((response: Team[]) => {
      console.log(response);
      this.teamList.next(response);
    });
    return this.teamList;
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

