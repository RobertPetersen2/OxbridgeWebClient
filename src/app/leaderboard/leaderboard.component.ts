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

  public teamList: Leaderboard[] = [];

  constructor(
    private leaderboardService: LeaderboardService,
  ) { 

    // Leaderboard
    const teamList = this.leaderboardService.getLeadereboard();
    teamList.subscribe((teamListData: Leaderboard[]) => {
      this.teamList = teamListData;
      console.log(this.teamList)
      
    });

  }

  ngOnInit(): void {
  }

}
