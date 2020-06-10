import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RaceServiceService } from '../service/race-service.service';
import { Race } from '../models/race';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CheckPoint } from '../models/check-point';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../service/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {

  public allRaces: Race[]; // <--- should be moved to race component - this is only testing

  // New Race
  public locationDescription: string;
  public startTime: Date;

  // Info about todays race (if there is one)
  public todaysRace: Race; 
  public isThereARaceToday: Boolean;
  public isRaceStarted: Boolean

  // Form
  public newRaceForm: FormGroup;

  constructor(
    private raceService: RaceServiceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private confirmationDialogService: ConfirmationDialogService) {
    this.isThereARaceToday = false;
    this.isRaceStarted = false; 

    const racesObservable = this.raceService.getRaces();
    racesObservable.subscribe((raceData: Race[]) => {
      this.allRaces = raceData;
      console.log(this.allRaces);
      // We wanna check if there is a race today. Because if thats the case, it should be possible to start it
      this.checkIfRaceToday();
    }
    );

    this.raceService.raceGoingOn.subscribe(
      (value: boolean) => {
        console.log("Race going on: " + value);
        if(value == true){
            this.isRaceStarted = true;
        } else {
            this.isRaceStarted = false;
        }
      }
    );
  }

  ngOnInit(): void {
    // We create our Reactive Form using Form Builder and set the validators
    this.newRaceForm = this.formBuilder.group({
      location: ['', [Validators.minLength(2), Validators.required]],
      date: ['', [Validators.minLength(6), Validators.required]],
      time: ['', [Validators.minLength(6), Validators.required]],
    });

  }

  editRace(raceID: number) {
    this.raceService.selectRaceID(raceID);
    this.router.navigate(['/race-editor']);
  }

  deleteRace(raceID: number) {
    this.raceService.deleteRace(raceID);

  }

  submit() {
    var newRace: Race = {
      raceID: -1, // -1 tells the server that we are creating a new race
      locationDescription: this.locationDescription,
      startTime: this.startTime,
      laps: 1,
      checkPoints: [],
      assignedTeams: [],
    };

    if (this.newRaceForm.invalid || this.newRaceForm.untouched) {
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

  deleteRaceDialog(raceID: number) {
    this.confirmationDialogService.confirm('Please confirm deletion of race', 'Do you really want to delete this race?', "Confirm", "Cancel", "lg")
      .then((confirmed) => {
        if (confirmed) {
          this.deleteRace(raceID);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  checkIfRaceToday() {
    let date = new Date();
    console.log("Todays date: " + date);
    let raceToday: Race = this.allRaces.find(x => new Date(x.startTime).getDate() === date.getDate());

    if (raceToday) {
      console.log("Did find a race today!");
      this.todaysRace = raceToday;
      this.isThereARaceToday = true;
    } else {
      console.log("Didn't find a race today!");
      this.isThereARaceToday = false;
      this.todaysRace = null;
    }

  }

  checkIfTimeYet(): Boolean {
    // Check if there is a race today first
    if(this.isThereARaceToday){
      var currentTime = new Date();
      // Check that its time to start a race
      if(new Date(this.todaysRace.startTime).getTime() < currentTime.getTime()){
        console.log("Starting race in time");
        return true;
      }
    }
    console.log("There is either no race today, or its too early to start the race");
    return false;
  }

  startRace(){
    var ready = this.checkIfTimeYet();
    if(ready){
      this.raceService.startRace(this.todaysRace.raceID);
    }
  }

  stopRace(){
    var ready = this.checkIfTimeYet();
    if(ready){
      this.raceService.stopRace(this.todaysRace.raceID);
    }
  }


}