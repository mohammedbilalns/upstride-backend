import { userData } from "../../common/types/user.types";
export interface IUserService {
	getUserById(userId: string): Promise<userData>;
	getUsersByIds(userIds: string[]): Promise<userData[]>;
}
