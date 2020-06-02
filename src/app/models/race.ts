import { CheckPoint } from './check-point';
import { Team } from './team';

export class Race {
    public raceID: number;
    public checkPoints: Array<CheckPoint>;
    public startTime:Date;
    public locationDescription:string;
    public laps: number;
    public assignedTeams: Team[];
}
