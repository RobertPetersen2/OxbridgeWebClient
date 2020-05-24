import { Component, OnInit, ViewChild } from '@angular/core';
import { MapMarker } from '@angular/google-maps';
import { CheckPoint } from '../models/check-point';
import { Race } from '../models/race';
import { RaceServiceService } from '../service/race-service.service';


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
  public currentRace:Race;

  public diagnosticDataRace: any;

  public allRaces:Race[]; // <--- should be moved to race component - this is only testing
  // public raceID: number;
  // public checkPoints: Array<CheckPoint>;
  // public startTime:Date;
  // public locationDescription:string;
  // public laps: number;



  constructor(private raceService : RaceServiceService) { 
    const racesObservable = this.raceService.getRaces();
    racesObservable.subscribe((raceData: Race[]) => {
    this.allRaces = raceData;
    console.log(this.allRaces);
    });

    const specificRaceObservable = this.raceService.getSpecificRace(1);
    specificRaceObservable.subscribe((raceData: Race) => {
    this.currentRace = raceData;
    this.diagnosticDataRace = JSON.stringify(raceData);
    console.log(this.currentRace);
    });


  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(position => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    });
  }

  // // Testing purposes: 
  // myLat = 54.9093;
  // myLong = 9.8074;

  // // Adds a random location - only meant for testing
  // addMarker() {
  //   this.markers.push({
  //     position: {
  //       lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
  //       lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
  //     },
  //     label: {
  //       color: 'red',
  //       text: 'Marker label ' + (this.markers.length + 1),
  //     },
  //     title: 'Marker title ' + (this.markers.length + 1),
  //     options: { animation: google.maps.Animation.BOUNCE },
  //   })
  // }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) this.zoom++
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) this.zoom--
  }

  click(event: google.maps.MouseEvent){
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
      checkpointNo: (this.markers.length +1),
    });
  }



  undoMarker(){
    this.markers.splice(-1,1)
  }

  submit(){

  }

}
