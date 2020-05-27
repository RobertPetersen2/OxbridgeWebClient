import { Component, OnInit, ViewChild } from '@angular/core';
import { MapMarker } from '@angular/google-maps';
import { CheckPoint } from '../models/check-point';
import { Race } from '../models/race';
import { RaceServiceService } from '../service/race-service.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-race-editor',
  templateUrl: './race-editor.component.html',
  styleUrls: ['./race-editor.component.css']
})

export class RaceEditorComponent implements OnInit {

  // Google Maps related properties
  zoom = 12
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
    streetViewControl: false
  }

  public markers: Array<object> = [];

  // Essential data
  public currentRace: Race;
  public diagnosticDataRace: any; // <--- DIAGNOSTICS / DEBUGGING

  // Form
  public raceEditForm: FormGroup;

  private returnUrl:string

  constructor(
    private raceService: RaceServiceService, 
    private formBuilder: FormBuilder, 
    private router:Router,
    private route:ActivatedRoute,
    ) {
    // Subscribing to the race of the backend
    const selectedRace = this.raceService.getSelectedRaceID();
    selectedRace.subscribe((raceIDSelected: number) => {
      const specificRaceObservable = this.raceService.getSpecificRace(raceIDSelected); // <-- THIS ONE IS RECEIVED FROM THE RACES COMPONENT
      specificRaceObservable.subscribe((raceData: Race) => {
        // Correct date and time
        var dateTimeFixed = new Date(raceData.startTime);
        this.currentRace = raceData;
        this.currentRace.startTime = dateTimeFixed;
  
        // DIAGNOSTICS - DEBUGGING
        this.diagnosticDataRace = JSON.stringify(this.currentRace); // <--- DIAGNOSTICS / DEBUGGING
        console.log(this.currentRace);

        // Load the check points when data is loaded
        this.loadCheckpoints();
      });
    })

    // const specificRaceObservable = this.raceService.getSpecificRace(999); // <-- THIS HAS TO BE SOME THING YOU CAN SPECIFY FROM RACES.COMPONENT
    // specificRaceObservable.subscribe((raceData: Race) => {
    //   // Correct date and time
    //   var dateTimeFixed = new Date(raceData.startTime);
    //   this.currentRace = raceData;
    //   this.currentRace.startTime = dateTimeFixed;

    //   // DIAGNOSTICS - DEBUGGING
    //   this.diagnosticDataRace = JSON.stringify(this.currentRace); // <--- DIAGNOSTICS / DEBUGGING
    //   console.log(this.currentRace);
    //   // Load the check points when data is loaded
    //   this.loadCheckpoints();
    // });
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    });

    // We create our Reactive Form using Form Builder and set the validators
    this.raceEditForm = this.formBuilder.group({
      location: ['', [Validators.minLength(2), Validators.required]],
      date: ['', [Validators.minLength(6), Validators.required]],
      time: ['', [Validators.minLength(6), Validators.required]],
    });

    this.returnUrl = '/races';
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--
  }

  addCurrentLocation(event: google.maps.MouseEvent) {
    console.log(event);
    this.markers.push({
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
      label: {
        color: 'red',
        text: 'Checkpoint ' + (this.markers.length + 1),
      },
      title: 'Checkpoint ' + (this.markers.length + 1),
      options: { animation: google.maps.Animation.BOUNCE },
      checkpointNo: (this.markers.length + 1),
    });

    // This one is saved for the json
    this.currentRace.checkPoints.push(
      {
        latitude: event.latLng.lat(),
        longitude: event.latLng.lng(),
      }
    );

  }

  loadCheckpoints() {
    // Get a reference to this
    var self = this;
 
    // Iterate through all the checkpoints from the loaded data
    this.currentRace.checkPoints.forEach(function (value) {
      console.log("Pushed new value to array: " + value.latitude + " and " + value.longitude);
      // We place it in the markers array as it contains display data, that we would normally not save in the model
      self.markers.push({
        position: {
          lat: value.latitude,
          lng: value.longitude
        },
        label: {
          color: 'red',
          text: 'Checkpoint ' + (self.markers.length + 1),
        },
        title: 'Checkpoint ' + (self.markers.length + 1),
        options: { animation: google.maps.Animation.BOUNCE },
        checkpointNo: (self.markers.length + 1),
      });
    });

  }



  undoMarker() {
    this.markers.splice(-1, 1)
    // This one is saved for the json that we post to the server
    this.currentRace.checkPoints.splice(-1,1);
  }

  submit() {


    if(this.raceEditForm.invalid || this.raceEditForm.untouched){
      console.log("Invalid input");
      return;
    }

    console.log("Submit was executed!");
    // Get all the data together and send it as a JSON to the server under the ID
    console.log("Server will send this info to the backend: ");
    console.log(this.currentRace);
    // POST IT -> And print the result in the console for debugging reasons 
    const response = this.raceService.postRace(this.currentRace);
    // response.subscribe((response: any) => {
    //   console.log("Response from the server: ");
    //   console.log(response);
    //   // Lets assume that the data was inserted. We then need to refresh the list
    //   this.raceService.getRaces();
    // });
    // Return to previous page
    this.router.navigate([this.returnUrl]);

  }



}
