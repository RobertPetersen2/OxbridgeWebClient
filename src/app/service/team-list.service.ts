import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamListService {

   teams: Team[] = [];

  constructor() { 
    this.teams.push(new Team("Team in teamlist.service!"));
  }

  public getTeamList(): Observable<Team[]> { //
    const arrayObservable = new Observable<Team[]>(observer => {
          observer.next(this.teams);
    });
    return arrayObservable;
  }

}
