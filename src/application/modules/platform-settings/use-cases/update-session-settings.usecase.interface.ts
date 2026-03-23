import type {
	UpdateSessionSettingsInput,
	UpdateSessionSettingsResponse,
} from "../dtos/update-session-settings.dto";

export interface IUpdateSessionSettingsUseCase {
	execute(
		input: UpdateSessionSettingsInput,
	): Promise<UpdateSessionSettingsResponse>;
}
