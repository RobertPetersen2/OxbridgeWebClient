import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { TeamListService } from '../service/team-list.service';
import { AuthenticationService } from '../service/authentication.service';
import { TEMPORARY_NAME } from '@angular/compiler/src/render3/view/util';
import { first } from 'rxjs/operators';
import { TeamMember } from '../models/team-member';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { AlertService } from '../service/alert.service';
import { Race } from '../models/race';
import { RaceServiceService } from '../service/race-service.service';
import { ConfirmationDialogService } from '../service/confirmation-dialog/confirmation-dialog.service';




@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.css']
})
export class TeamListComponent implements OnInit {

  public teamList: Team[] = [];
  public teamMembers: TeamMember[];
  public racesAssignedList: Race[];
  public racesAvailable: Race[];

  public currentlyEditing: string;
  currentUser: User;

  constructor(
    private teamListService: TeamListService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private raceService: RaceServiceService,
    private confirmationDialogService : ConfirmationDialogService
  ) {

    // Used to show visual things to specific role / used to hide things if the user isnt in a expected role.
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    
    
    // Get a list of all teams
    let currentUser = this.authenticationService.currentUserValue;

    // Will show a list for admin
    if (currentUser.isAdmin === true) {
      const teamList = this.teamListService.getTeamList();
      teamList.subscribe((teamListData: Team[]) => {
        this.teamList = teamListData;
      });
    }

    // This part will only happen if the user is a team leader
    if (currentUser.isTeamLeader === true) {
      const teamList = this.teamListService.getTeamList();
      teamList.subscribe((teamListData: Team[]) => {
        this.teamList = teamListData;
        let teamObj = JSON.parse(JSON.stringify(teamListData));

        // Place users from the team into the members array/table
        let usersArray: TeamMember[] = teamObj.users;
        this.teamMembers = usersArray
        this.currentlyEditing = teamObj.teamName;
        console.log(this.teamMembers)

        const racesList = this.raceService.getRacesAssignedToTeam();
        racesList.subscribe((raceListData: Race[]) => {
          this.racesAssignedList = raceListData;
        });

        const racesAvailableList = this.raceService.getAvailableRacesByTeam(currentUser.team);
        racesAvailableList.subscribe((raceListData: Race[]) => {
          this.racesAvailable = raceListData;
        });

        this.raceService.dataHasChanged.subscribe((st: string) => {
          console.log(st);
          // Refresh the list of races assigned - and available races as well
          this.raceService.getRacesAssignedToTeam(); 
          this.raceService.getAvailableRacesByTeam(currentUser.team);
        });


      });

    }
  }


  // Modify teams
  editTeam(team: Team): any {
    const index: number = this.teamList.indexOf(team);  // get index of selected item
    console.log("Editing team: " + team.teamName);
    this.teamMembers = team.users;
    console.log(this.teamMembers);
    this.currentlyEditing = team.teamName
  }

  // Delete a user from a team
  deleteUser(user: string) {
    console.log("You are trying to delete user from team: " + this.currentlyEditing + user);
    // We delete the user from the team, which should automatically update the teamlist that we are subscribing to
    // So no further action should be required
    this.teamListService.deleteUserFromTeam(this.currentlyEditing, user);
    // If you are deleting yourself, you should be logged out - atm
    if (user == this.authenticationService.currentUserValue.username) {
      this.authenticationService.logout();
    }
    if (this.currentUser.isTeamLeader === true) {
      location.reload(true);
    }

  }

  // Delete a team as admin
  deleteTeam(teamName: string) {
    this.teamListService.deleteTeam(teamName);

  }

  // Delete a team as TeamLeader
  deleteTeamTL() {
    if (this.currentUser.isTeamLeader === true) {
      let teamName = this.currentlyEditing;
      this.teamListService.deleteTeam(teamName);

      // As long as its not possible to re-create a team, the user should be logged out
      this.authenticationService.logout();
      this.alertService.success('You have been logged out', true);
      this.router.navigate(['/login-form']);
    }
  }

  assignRaceToTeamTL(raceID:number, teamName:string){
    this.raceService.assignTeamByRaceId(raceID, teamName);
  }

  removeTeamFromRace(raceID:number, teamName:string){
    this.raceService.removeTeamFromRace(raceID,teamName);
  }

  openDeleteOwnTeamDialog() {
    this.confirmationDialogService.confirm('Please confirm deletion of team', 'Do you really want to delete your team?',"Confirm","Cancel","lg")
    .then((confirmed) => {
      if(confirmed){
        this.deleteTeamTL();
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  openDeleteOtherTeamDialog(teamName: string) {
    this.confirmationDialogService.confirm('Please confirm deletion of team', 'Do you really want to delete this team?',"Confirm","Cancel","lg")
    .then((confirmed) => {
      if(confirmed){
        this.deleteTeam(teamName);
      }
    })
    .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  ngOnInit(): void {


  }


}