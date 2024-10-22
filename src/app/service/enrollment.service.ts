import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../models/team';
import { HttpClient } from '@angular/common/http';
import { EnrollmentStatus } from '../enroll-participant/enrollment-status.enum';
import { PendingUser } from '../models/pending-user';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private currentUserEnrollmentStatus: BehaviorSubject<EnrollmentStatus>;
  private availableTeams: BehaviorSubject<Team[]>;
  private pendingApprovals: BehaviorSubject<PendingUser[]>;
  private currentTeam: BehaviorSubject<string>;
  // Event used as notification to other components
  public newDataAdded = new EventEmitter<string>();

  constructor(private http: HttpClient) {
    this.currentUserEnrollmentStatus = new BehaviorSubject<EnrollmentStatus>(EnrollmentStatus.Undefined);
    this.availableTeams = new BehaviorSubject<Team[]>([]);
    this.pendingApprovals = new BehaviorSubject<PendingUser[]>([]);
    this.currentTeam = new BehaviorSubject<string>(null);
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

  // Only if there is in fact a team attached to the user, otherwise it will just say 'null' untill someone approves the enrollment
  public getYourTeam() : Observable<string> {
    const teamObj = this.http.get('http://148.251.122.228:3000/teams/yourTeam');
    teamObj.subscribe(
      data => {
        let obj = JSON.parse(JSON.stringify(data));
        if(obj.hasOwnProperty('team')){
          console.log("The response contains a team name for the user");
          this.currentTeam.next(obj.team);
        }
      },
      error => {
        console.log(error);
      }
    )
    return this.currentTeam;
  }

  public leaveTeam(username:string) : void {
    const teamObj = this.http.delete('http://148.251.122.228:3000/enrollment/leave');
    teamObj.subscribe(
      data => {
        let obj = JSON.parse(JSON.stringify(data));
        if(obj.hasOwnProperty('team') && obj.hasOwnProperty('user')){
          console.log("The response contains a teamname and a user");
          if(obj.team == 'left'){
            this.newDataAdded.emit("User has left the team");
          }
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  // TEAM LEADER SECTION: 
  //#region 

  public getPendingApprovals() : BehaviorSubject<PendingUser[]>{
    const pendingApprovals = this.http.get<PendingUser[]>('http://148.251.122.228:3000/enrollment/pending');
    pendingApprovals.subscribe((response: PendingUser[]) => {
      this.pendingApprovals.next(response);
    })

    return this.pendingApprovals;
  }

  public manageApproval(accept:boolean, username:string, team:string): void{
    const approval = this.http.post<any>('http://148.251.122.228:3000/enrollment/manageApproval', {accept, team, username});
    approval.subscribe(
        data => {
          let obj = JSON.parse(JSON.stringify(data));
          console.log(obj);
          if(obj.action == 'success'){
            console.log("Approval/Rejection was a success");
            let pendingApprovalsLocal: PendingUser[] = this.pendingApprovals.getValue();
            let index = this.getIndexByUsername(username);
            if(index!==-1){
              pendingApprovalsLocal.splice(index, 1);
              console.log("Deleted race with index number:" + index);
              // Then we set the observable to the copy that we made
              this.pendingApprovals.next(pendingApprovalsLocal);
            }
          }
        },
        error => {
          console.log("Error Message:" + JSON.stringify(error))
        }
    )

  }

  private getIndexByUsername(username:string) : any {
    // We create a temporary variable of the races observable
    let pendingApprovalsLocal: PendingUser[] = this.pendingApprovals.getValue();
    // We find the object in our array with this ID
    let pAprovealObj: PendingUser = pendingApprovalsLocal.find(x => x.username === username);
    // Then we find the index of that object
    const index: number = pendingApprovalsLocal.indexOf(pAprovealObj);
    if(index!==-1){
      return index; 
    } else {
      return -1;
    }
  }


 //#endregion



}
