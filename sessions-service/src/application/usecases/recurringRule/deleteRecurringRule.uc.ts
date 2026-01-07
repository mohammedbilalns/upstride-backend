import { ErrorMessage, HttpStatus } from "../../../common/enums";
import { IAvailabilityRepository } from "../../../domain/repositories/availability.repository.interface";
import { IDeleteRecurringRuleUC } from "../../../domain/useCases/recurringRule/deleteRecurringRule.uc.interface";
import { DeleteRecurringRuleDto } from "../../dtos/recurringRule.dto";
import { AppError } from "../../errors/AppError";

export class DeleteRecurringRuleUC implements IDeleteRecurringRuleUC {
	constructor(private _availabilityRepository: IAvailabilityRepository) {}

	async execute(dto: DeleteRecurringRuleDto): Promise<void> {
		const existingAvailabilityRule =
			await this._availabilityRepository.findByMentorId(dto.mentorId);

		if (!existingAvailabilityRule) {
			throw new AppError(ErrorMessage.RULE_NOT_FOUND, HttpStatus.NOT_FOUND);
		}

		const updatedRule = {
			...existingAvailabilityRule,
			recurringRules: existingAvailabilityRule.recurringRules.filter(
				(rule) => rule.ruleId !== dto.ruleId,
			),
		};

		this._availabilityRepository.update(
			existingAvailabilityRule.id,
			updatedRule,
		);
	}
}
