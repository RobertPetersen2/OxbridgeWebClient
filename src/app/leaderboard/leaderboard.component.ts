import { Component, OnInit } from '@angular/core';
import { Leaderboard } from '../models/leaderboard';
import { Router } from '@angular/router';
import { LeaderboardService } from '../service/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  public leaderBoard: Leaderboard[] = [];

  constructor(
    private leaderboardService: LeaderboardService,
  ) { 

    // Leaderboard
    // EXAMPLE STRING:   
    // {"Leaderboard":[{"TeamName":"Pierres SuperSurfers","Tag":1,"CompleteTime":"2020-06-10T10:47:34.940Z"}],"Header":"checkpoint","TeamName":""}
    const leaderBoard = this.leaderboardService.getLeadereboard();
    leaderBoard.subscribe((leaderBoardData: Leaderboard[]) => {
      this.leaderBoard = leaderBoardData;
      console.log(this.leaderBoard)
      
    });

  }

  ngOnInit(): void {
  }

}
