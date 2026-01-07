import { GetMentorRuleResponse } from "../../../application/dtos/recurringRule.dto";
import { GetMentorRule } from "../../../application/dtos/slot.dto";

export interface IGetRulesUC {
	execute(dto: GetMentorRule): Promise<GetMentorRuleResponse>;
}
