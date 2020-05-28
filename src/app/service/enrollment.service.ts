import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../models/team';
import { HttpClient } from '@angular/common/http';
import { EnrollmentStatus } from '../enroll-participant/enrollment-status.enum';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private currentUserEnrollmentStatus: BehaviorSubject<EnrollmentStatus>;
  public newDataAdded = new EventEmitter<string>();
  private availableTeams: BehaviorSubject<Team[]>;
  
  constructor(private http: HttpClient) {
    this.currentUserEnrollmentStatus = new BehaviorSubject<EnrollmentStatus>(EnrollmentStatus.Undefined);
    this.availableTeams = new BehaviorSubject<Team[]>([]);

   }


   public getStatus(): Observable<EnrollmentStatus> {
    // Load the races from the DB
    const statusObj = this.http.get<any>('http://148.251.122.228:3000/enrollment/status');
    // If this method is called again we update the observable
    statusObj.subscribe((response: any) => {
      let obj = JSON.parse(JSON.stringify(response));
      if(obj.code==1){
        console.log("Enrollment code 1. User has no team");
        if(this.currentUserEnrollmentStatus.value !== EnrollmentStatus.NoTeam){
          this.currentUserEnrollmentStatus.next(EnrollmentStatus.NoTeam);
        } 

      } else if(obj.code==2){
        console.log("Enrollment code 2. User is waiting for approval");
        if(this.currentUserEnrollmentStatus.value !== EnrollmentStatus.WaitingApproval){
          this.currentUserEnrollmentStatus.next(EnrollmentStatus.WaitingApproval);
        } 

      } else if(obj.code==3){
        console.log("Enrollment code 3. User has a team");
        if(this.currentUserEnrollmentStatus.value != EnrollmentStatus.HaveTeam){
          this.currentUserEnrollmentStatus.next(EnrollmentStatus.HaveTeam);
        } 

      } else {
        console.log("No enrollment code. Undefined");
        if(this.currentUserEnrollmentStatus.value != EnrollmentStatus.Undefined){
          this.currentUserEnrollmentStatus.next(EnrollmentStatus.Undefined);
        } 
      }
    });
    return this.currentUserEnrollmentStatus;
  }

  public getAvailableTeams(): Observable<Team[]> {
    // Load the races from the DB
    const teamObj = this.http.get<Team[]>('http://148.251.122.228:3000/teams/availableTeams');
    // If this method is called again we update the observable
    teamObj.subscribe((response: Team[]) => {
      console.log(response);
      this.availableTeams.next(response);


    });
    return this.availableTeams;
  }


  public applyForTeam(username:string, team:string): void {
    // Load the races from the DB
    const applyObj = this.http.post<any>('http://148.251.122.228:3000/enrollment/apply', {username, team});
    // If this method is called again we update the observable
    applyObj.subscribe((response: any) => {
      console.log(response);
      console.log("Status code: " + response.status);
        console.log("Status code 200: Accepted");
        this.newDataAdded.emit('New data added successfully');

    });

   
  }




}
