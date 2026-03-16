import type {
	UpdateContentSettingsInput,
	UpdateContentSettingsResponse,
} from "../dtos/update-content-settings.dto";

export interface IUpdateContentSettingsUseCase {
	execute(
		input: UpdateContentSettingsInput,
	): Promise<UpdateContentSettingsResponse>;
}
