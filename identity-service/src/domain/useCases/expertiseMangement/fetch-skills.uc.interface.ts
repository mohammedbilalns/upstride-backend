import { fetchSkillsDto, FetchSkillsResponse } from "../../../application/dtos";

export interface IFetchSkillsUC {
	execute(data: fetchSkillsDto): Promise<FetchSkillsResponse>;
}
