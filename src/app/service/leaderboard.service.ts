import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Leaderboard } from '../models/leaderboard';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  private leaderBoard: BehaviorSubject<Leaderboard[]>;

  constructor(private http:HttpClient) { 

    this.leaderBoard = new BehaviorSubject<Leaderboard[]>([]);

  }

  public getLeadereboard(): Observable<Leaderboard[]>{
    const leaderBoard = this.http.get<Leaderboard[]>('http://148.251.122.228:3000/races/leaderboard');
    leaderBoard.subscribe((response: Leaderboard[]) => {
      // this.teamList.next(response);
      let teamObj = JSON.parse(JSON.stringify(response));

      //console.log(teamObj.Leaderboard);
      console.log(response)
        
        this.leaderBoard.next(teamObj.Leaderboard);
    });
    return this.leaderBoard;
  }

}
