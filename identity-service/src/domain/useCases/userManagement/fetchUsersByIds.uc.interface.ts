import { User } from "../../entities";

export interface IFetchUsersByIdsUC {
	execute(userIds: string[]): Promise<User[]>;
}
