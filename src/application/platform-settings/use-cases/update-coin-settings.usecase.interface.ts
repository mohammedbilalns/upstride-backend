import type {
	UpdateEconomySettingsInput,
	UpdateEconomySettingsResponse,
} from "../dtos/update-coin-settings.dto";

export interface IUpdateEconomySettingsUseCase {
	execute(
		input: UpdateEconomySettingsInput,
	): Promise<UpdateEconomySettingsResponse>;
}
