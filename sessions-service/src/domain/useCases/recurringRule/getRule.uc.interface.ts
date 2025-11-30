import { getMentorRuleResponse } from "../../../application/dtos/recurringRule.dto";
import { getMentorRule } from "../../../application/dtos/slot.dto";

export interface IGetRulesUC {
	execute(dto: getMentorRule): Promise<getMentorRuleResponse>;
}
