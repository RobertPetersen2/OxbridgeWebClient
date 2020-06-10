import { Injectable, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Race } from '../models/race';
import { CheckPoint } from '../models/check-point';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class RaceServiceService {

  // Event
  public dataHasChanged = new EventEmitter<string>();
  public raceGoingOn = new EventEmitter<boolean>();

  private availableTeamsForRaceID: BehaviorSubject<Team[]>
  private availableRacesForTeam: BehaviorSubject<Race[]>

  private currentRaceID: BehaviorSubject<number>;  
  private allRaces: BehaviorSubject<Race[]>;

  private racesAssignedForSelectedTeam: BehaviorSubject<Race[]>

  testDate: Date;
  constructor(private http: HttpClient) {
    this.currentRaceID= new BehaviorSubject<number>(-1);
    this.allRaces = new BehaviorSubject<Race[]>([]);
    this.availableTeamsForRaceID = new BehaviorSubject<Team[]>([]);
    this.availableRacesForTeam = new BehaviorSubject<Race[]>([]);
    this.racesAssignedForSelectedTeam = new BehaviorSubject<Race[]>([]);
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

  getAvailableTeamsByRaceId(raceID:number) : Observable<Team[]> {
    // Load the teams from the DB <--- TODO make it only show available teams, and not all teams
    const teamsObj = this.http.get<Team[]>('http://148.251.122.228:3000/teams/');
    // If this method is called again we update the observable
    teamsObj.subscribe((response: Team[]) => {
      this.availableTeamsForRaceID.next(response)
    });
    return this.availableTeamsForRaceID;
  }

  getAvailableRacesByTeam(team:string) : Observable<Race[]> {
        // Load the races from the DB 
        const racesObj = this.http.get<Race[]>('http://148.251.122.228:3000/races/availableRaces');
        // If this method is called again we update the observable
        racesObj.subscribe((response: Race[]) => {
          this.availableRacesForTeam.next(response)
        });
        return this.availableRacesForTeam;

  }

  getRacesAssignedToTeam() : Observable<Race[]> {
    // Load the races of the token-holder (team leader)
    const teamsObj = this.http.get<Race[]>('http://148.251.122.228:3000/races/assignedRaces');
    // If this method is called again we update the observable
    teamsObj.subscribe((response: Race[]) => {
      this.racesAssignedForSelectedTeam.next(response);
    });
    return this.racesAssignedForSelectedTeam;
  }

  assignTeamByRaceId(raceID:number, teamName:string): void{
    const response = this.http.post<any>('http://148.251.122.228:3000/races/assignTeam',{raceID, teamName});
    response.subscribe(
      data => {
        let obj = JSON.parse(JSON.stringify(data));
        if(obj.hasOwnProperty('action')){
          if(obj.action == "success"){
            this.dataHasChanged.emit("The team was assigned to the race without errors");
          }
        }
       },
      error => console.log("ERROR MESSAGE:" + JSON.stringify(error))
    );
  }

  removeTeamFromRace(raceID:number, teamName:string): void{
    const response = this.http.post<any>('http://148.251.122.228:3000/races/removeTeam/' + raceID,{teamName});
    response.subscribe(
      data => {
        let obj = JSON.parse(JSON.stringify(data));
        if(obj.hasOwnProperty('action')){
          if(obj.action == "success"){
            this.dataHasChanged.emit("The team was un-assigned from the race without errors");
          }
        }
       },
      error => console.log("ERROR MESSAGE:" + JSON.stringify(error))
    );
  }

  startRace(raceID:number): void{
    const response = this.http.post<any>('http://148.251.122.228:3000/races/startRace/' + raceID,{});
    response.subscribe(
      data => {
        let obj = JSON.parse(JSON.stringify(data));
        if(obj.hasOwnProperty('startedRace')){
          if(obj.startedRace == true){
            this.raceGoingOn.emit(true);
          }
        }
       },
      error => console.log("ERROR MESSAGE:" + JSON.stringify(error))
    );
  }

  stopRace(raceID:number): void{
    this.raceGoingOn.emit(false);

    // TODO MAKE THIS CODE WORK: 

    // const response = this.http.post<any>('http://148.251.122.228:3000/races/stopRace/' + raceID,{});
    // response.subscribe(
    //   data => {
    //     let obj = JSON.parse(JSON.stringify(data));
    //     if(obj.hasOwnProperty('stoppedRace')){
    //       if(obj.stoppedRace == true){
    //         this.raceGoingOn.emit(false);
    //       }
    //     }
    //    },
    //   error => console.log("ERROR MESSAGE:" + JSON.stringify(error))
    // );
  }

  checkIfOnGoingRace(): Race{
    // TODO check if there is a race going on right now 

    return new Race();
  }

  

  




}
