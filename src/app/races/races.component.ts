import { Component, OnInit } from '@angular/core';
import { RaceServiceService } from '../service/race-service.service';
import { Race } from '../models/race';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {

  public allRaces:Race[]; // <--- should be moved to race component - this is only testing

  constructor(private raceService : RaceServiceService) { 
    const racesObservable = this.raceService.getRaces();
    racesObservable.subscribe((raceData: Race[]) => {
    this.allRaces = raceData;
    console.log(this.allRaces);
    });
  }

  ngOnInit(): void {
  }

}
