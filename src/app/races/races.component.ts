import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RaceServiceService } from '../service/race-service.service';
import { Race } from '../models/race';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CheckPoint } from '../models/check-point';
import { Router } from '@angular/router';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {

  public allRaces:Race[]; // <--- should be moved to race component - this is only testing

  // New Race
  public locationDescription:string;
  public startTime:Date;

  // Form
  public newRaceForm: FormGroup;

  constructor(
    private raceService : RaceServiceService,
    private formBuilder: FormBuilder,
    private router:Router) { 
    const racesObservable = this.raceService.getRaces();
    racesObservable.subscribe((raceData: Race[]) => {
    this.allRaces = raceData;
    console.log(this.allRaces);
    });
  }

  ngOnInit(): void {
    // We create our Reactive Form using Form Builder and set the validators
    this.newRaceForm = this.formBuilder.group({
      location: ['', [Validators.minLength(2), Validators.required]],
      date: ['', [Validators.minLength(6), Validators.required]],
      time: ['', [Validators.minLength(6), Validators.required]],
    });
  }

  editRace(raceID:number){
    this.raceService.selectRaceID(raceID);
    this.router.navigate(['/race-editor']);
  }

  deleteRace(raceID:number){
    this.raceService.deleteRace(raceID);

  }

  submit(){
    var newRace: Race = { raceID: -1, // -1 tells the server that we are creating a new race
      locationDescription: this.locationDescription, 
      startTime: this.startTime, 
      laps:1, 
      checkPoints: [],
      assignedTeams: [],
    };

    if(this.newRaceForm.invalid || this.newRaceForm.untouched){
       console.log("Invalid input");
       return;
     }

    console.log("Submit was executed!");
    // Get all the data together and send it as a JSON to the server under the ID
    console.log("Server will send this info to the backend: ");
    console.log(newRace);
    // Post it, and if it was a success it should automatically appear in the table
    this.raceService.postRace(newRace);

  }


}