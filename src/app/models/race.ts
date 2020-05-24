import { CheckPoint } from './check-point';

export class Race {
    public raceID: number;
    public checkPoints: Array<CheckPoint>;
    public startTime:Date;
    public locationDescription:string;
    public laps: number;
}
