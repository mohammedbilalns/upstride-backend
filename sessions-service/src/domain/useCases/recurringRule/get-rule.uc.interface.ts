import { GetMentorRuleResponse } from "../../../application/dtos/recurring-rule.dto";
import { GetMentorRule } from "../../../application/dtos/slot.dto";

export interface IGetRulesUC {
	execute(dto: GetMentorRule): Promise<GetMentorRuleResponse>;
}
