import type { EconomySettingsDto } from "./platform-settings.types.dto";

export interface UpdateEconomySettingsInput {
	economy: EconomySettingsDto;
}

export interface UpdateEconomySettingsResponse {
	economy: EconomySettingsDto;
}
