import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamListService {

   teams: Team[] = [];

  constructor(private http:HttpClient) { 
    this.teams.push(new Team("Team in teamlist.service!"));
  }

  public getTeamList(): Observable<Team[]> { //
    const arrayObservable = new Observable<Team[]>(observer => {
          observer.next(this.teams);
    });
    return arrayObservable;
  }

}
