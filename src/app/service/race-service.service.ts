import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Race } from '../models/race';
import { CheckPoint } from '../models/check-point';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RaceServiceService {


  private currentRaceID: BehaviorSubject<number>;

  private allRaces: BehaviorSubject<Race[]>;

  testDate: Date;
  constructor(private http: HttpClient) {
    this.currentRaceID= new BehaviorSubject<number>(-1);
    this.allRaces = new BehaviorSubject<Race[]>([]);
    // Test date (ignore)
    this.testDate = new Date("2020-07-16");
    this.testDate.setHours(10);
    this.testDate.setMinutes(30);
    console.log("Test date: " + this.testDate);

  }


  public getRaces(): Observable<Race[]> {
    // Load the races from the DB
    const raceObj = this.http.get<Race[]>('http://148.251.122.228:3000/races/');
    // If this method is called again we update the observable
    raceObj.subscribe((response: Race[]) => {
      this.allRaces.next(response);
    });
    return this.allRaces;
  }

  public getSpecificRace(raceID: number): Observable<Race> {
    // Should just be currentRaceSelected
    return this.http.get<Race>('http://148.251.122.228:3000/races/' + raceID);
  }

  public postRace(race: Race): void {
    const response = this.http.post<any>('http://148.251.122.228:3000/races', race);
    response.subscribe(
      data => {
        let obj = JSON.parse(JSON.stringify(data));
        let allRacesLocal: Race[] = this.allRaces.getValue();
        if(obj.newRaceAdded === true){
          console.log("Response:" + JSON.stringify(data));
          // We want the new raceID:
          let newRaceID = obj.newRaceID;
          race.raceID = newRaceID;
          // If it was a success, we will add it to the observable 
          allRacesLocal.push(race);
          this.allRaces.next(allRacesLocal);
        } else if(obj.updatedRace === true){
          let index = this.getIndexByRaceId(race.raceID);
          if(index!==-1){
            // We get our hands on the object and update its values
            allRacesLocal[index] = race;
            console.log("Updated race with index number:" + index);
            // Then we set the observable to the copy that we made
            this.allRaces.next(allRacesLocal);
            }
        }
       },
      error => console.log("ERROR MESSAGE:" + JSON.stringify(error))
    );

  }

  public deleteRace(raceID: number) : void {
     this.http.delete('http://148.251.122.228:3000/races/' + raceID).subscribe(
       data => {
         console.log("Response:" + JSON.stringify(data));
         let obj = JSON.parse(JSON.stringify(data));
         // If the attribute 'removed' in the response is true, we will remove it from our collection visually
         if(obj.removed == true){
             // We create a temporary variable of the races observable
            let allRacesLocal: Race[] = this.allRaces.getValue();
            let index = this.getIndexByRaceId(raceID);
            if(index!==-1){
            // We remove it (but still in the copy)
            allRacesLocal.splice(index, 1);
            console.log("Deleted race with index number:" + index);
            // Then we set the observable to the copy that we made
            this.allRaces.next(allRacesLocal);
            }
         }
        },
       error => console.log("Error Message:" + JSON.stringify(error))
     );
  }

  public selectRaceID(raceID: number) : void {
    this.currentRaceID.next(raceID);
  }

  getSelectedRaceID(): Observable<number> {
    return this.currentRaceID.asObservable();
  }

  private getIndexByRaceId(raceID:number) : any {
    // We create a temporary variable of the races observable
    let allRacesLocal: Race[] = this.allRaces.getValue();
    // We find the object in our array with this ID
    let raceObj: Race = allRacesLocal.find(x => x.raceID === raceID);
    // Then we find the index of that object
    const index: number = allRacesLocal.indexOf(raceObj);
    if(index!==-1){
      return index; 
    } else {
      return -1;
    }
  }


}
