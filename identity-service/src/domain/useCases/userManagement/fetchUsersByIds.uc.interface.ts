import { FetchUsersByIdsDto } from "../../../application/dtos/user.dto";
import { User } from "../../entities";

export interface IFetchUsersByIdsUC {
	execute(dto: FetchUsersByIdsDto): Promise<User[]>;
}
