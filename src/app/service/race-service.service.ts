import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Race } from '../models/race';
import { CheckPoint } from '../models/check-point';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RaceServiceService {


  testDate:Date;
  constructor(private http: HttpClient){
    // Test date (ignore)
    this.testDate = new Date("2020-07-16");
    this.testDate.setHours(10);
    this.testDate.setMinutes(30);
    console.log("Test date: " + this.testDate);

    // // Connection to backend
    // this.http.get<Race[]>('http://148.251.122.228:3000/races').subscribe((res) => {console.log(res)})
  }

// Currently testing - should fetch from backend
  races:Race[] = [{
    raceID:1,
    startTime: this.testDate,
    locationDescription: "Sønderborg Havn",
    checkPoints: [new CheckPoint(54.91266530517256, 9.782062397903898), new CheckPoint(54.91458942451519,9.78000246138046), new CheckPoint(54.916094120416176, 9.775195942825773)],
    laps: 1
  },
  {
    raceID:2,
    startTime: this.testDate,
    locationDescription: "Sønderborg Havn",
    checkPoints: [new CheckPoint(54.91266530517256, 9.782062397903898), new CheckPoint(54.91458942451519,9.78000246138046), new CheckPoint(54.916094120416176, 9.775195942825773)],
    laps: 1
    
  },
  {
    raceID:3,
    startTime: this.testDate,
    locationDescription: "Sønderborg Havn",
    checkPoints: [new CheckPoint(54.91266530517256, 9.782062397903898), new CheckPoint(54.91458942451519,9.78000246138046), new CheckPoint(54.916094120416176, 9.775195942825773)],
    laps: 1
  },
  {
    raceID:4,
    startTime: this.testDate,
    locationDescription: "Sønderborg Havn",
    checkPoints: [new CheckPoint(54.91266530517256, 9.782062397903898), new CheckPoint(54.91458942451519,9.78000246138046), new CheckPoint(54.916094120416176, 9.775195942825773)],
    laps: 1
  }];



  public getRaces(): Observable<Race[]> {
    // const racesObservable = new Observable<Race[]>(observer => {
    //        setTimeout(() => {
    //            observer.next(this.races);
    //        }); 
    // });
    // return racesObservable

    return this.http.get<Race[]>('http://148.251.122.228:3000/races/');
  }

  public getSpecificRace(raceID:number): Observable<Race> {

    return this.http.get<Race>('http://148.251.122.228:3000/races/'+raceID);
  }

  public postRace(race:Race): Observable<any> {
    return this.http.post<any>('http://148.251.122.228:3000/races', race);
}


}
