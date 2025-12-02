import { Mentor } from "../../entities";

export interface IFetchSelfUC {
	execute(userId: string): Promise<Mentor>;
}
