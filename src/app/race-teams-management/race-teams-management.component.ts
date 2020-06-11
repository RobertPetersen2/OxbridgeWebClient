import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { RaceServiceService } from '../service/race-service.service';
import { Race } from '../models/race';

@Component({
  selector: 'app-race-teams-management',
  templateUrl: './race-teams-management.component.html',
  styleUrls: ['./race-teams-management.component.css']
})
export class RaceTeamsManagementComponent implements OnInit {


  public currentRace:Race;
  public availableTeams:Team[];
  public selectedTeam: string;
  public teamsAttending:Team[];

  constructor(private raceService:RaceServiceService) { 
    this.teamsAttending = [] as Team[];
    // Get hands on the currently selected RaceID and the race object associated
    const selectedRace = this.raceService.getSelectedRaceID();
    selectedRace.subscribe((raceIDSelected: number) => {
      const specificRaceObservable = this.raceService.getSpecificRace(raceIDSelected); // <-- THIS ONE IS RECEIVED FROM THE RACES COMPONENT
      specificRaceObservable.subscribe((raceData: Race) => {
          // Set the race data received from the server
          this.currentRace = raceData;
          this.teamsAttending = raceData.assignedTeams;
          console.log("Race data: " + JSON.stringify(this.currentRace));
          console.log("Team size: " + this.teamsAttending.length);

          // Get the list of available teams in this particular raceID
          const availableTeams = this.raceService.getAvailableTeamsByRaceId(this.currentRace.raceID);
          availableTeams.subscribe((teamsAvailableData: Team[]) => {
            this.availableTeams = teamsAvailableData;
          });

          // Subscribe to events/changes in data
          raceService.dataHasChanged.subscribe(
            (st: string) => {
              console.log(st);
              // Refresh the race to see the changes
              this.raceService.getSpecificRace(raceIDSelected).subscribe((raceData: Race) => { this.teamsAttending = raceData.assignedTeams; });
            }
          );

      });
    });    
    console.log("Teams attending: " + JSON.stringify(this.teamsAttending));
  }

  ngOnInit(): void {
  }

  /**
   * Used for setting the value of selectedTeam. Is usually set in the dropdown menu, when the user clicks on a team
   * @param team 
   */
  click(team: string): void {
    this.selectedTeam = team;
  }

  /**
   * Will assign a team to a race
   * @param raceID 
   * @param teamName 
   */
  assignTeam(raceID:number, teamName:string){
    this.raceService.assignTeamByRaceId(raceID, teamName);
  }

  /**
   * Will remove the team again from the race
   * @param raceID
   * @param teamName 
   */
  removeTeam(raceID:number, teamName:string){
    this.raceService.removeTeamFromRace(raceID,teamName);
  }

}
