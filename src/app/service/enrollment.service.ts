import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../models/team';
import { HttpClient } from '@angular/common/http';
import { EnrollmentStatus } from '../enroll-participant/enrollment-status.enum';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private currentUserEnrollmentStatus: BehaviorSubject<EnrollmentStatus>;

  private availableTeams: BehaviorSubject<Team[]>;
  
  constructor(private http: HttpClient) {
    this.currentUserEnrollmentStatus = new BehaviorSubject<EnrollmentStatus>(EnrollmentStatus.Undefined);
    this.availableTeams = new BehaviorSubject<Team[]>([]);

   }

   public getStatus(): Observable<EnrollmentStatus> {
    // Load the races from the DB
    const raceObj = this.http.get<any>('http://148.251.122.228:3000/enrollment/status');
    // If this method is called again we update the observable
    raceObj.subscribe((response: any) => {
      let obj = JSON.parse(JSON.stringify(response));
      if(obj.code==1){
        console.log("Enrollment code 1. User has no team");
        this.currentUserEnrollmentStatus.next(EnrollmentStatus.NoTeam);
      } else if(obj.code==2){
        console.log("Enrollment code 2. User is waiting for approval");
        this.currentUserEnrollmentStatus.next(EnrollmentStatus.WaitingApproval);
      } else if(obj.code==3){
        console.log("Enrollment code 3. User has a team");
        this.currentUserEnrollmentStatus.next(EnrollmentStatus.HaveTeam);
      } else {
        console.log("No enrollment code. Undefined");
        this.currentUserEnrollmentStatus.next(EnrollmentStatus.Undefined);
      }
      
    });
    return this.currentUserEnrollmentStatus;
  }
}
