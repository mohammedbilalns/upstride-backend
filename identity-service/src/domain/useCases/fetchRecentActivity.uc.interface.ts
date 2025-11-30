import { Activity } from "../../application/dtos/connection.dto";

export interface IFetchRecentActivityUC {
	execute(userId: string): Promise<Activity[]>;
}
