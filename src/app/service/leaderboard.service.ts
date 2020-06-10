import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Leaderboard } from '../models/leaderboard';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  private teamList: BehaviorSubject<Leaderboard[]>;

  constructor(private http:HttpClient) { 

    this.teamList = new BehaviorSubject<Leaderboard[]>([]);

  }

  public getLeadereboard(): Observable<Leaderboard[]>{
    const teamList = this.http.get<Leaderboard[]>('http://148.251.122.228:3000/races/leaderboard');
    teamList.subscribe((response: Leaderboard[]) => {
      this.teamList.next(response);
    });
    return this.teamList;
  }

}
