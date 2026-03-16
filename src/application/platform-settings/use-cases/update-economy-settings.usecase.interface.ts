import type {
	UpdateEconomySettingsInput,
	UpdateEconomySettingsResponse,
} from "../dtos/update-economy-settings.dto";

export interface IUpdateEconomySettingsUseCase {
	execute(
		input: UpdateEconomySettingsInput,
	): Promise<UpdateEconomySettingsResponse>;
}
