import type { SessionSettingsDto } from "./platform-settings.types.dto";

export interface UpdateSessionSettingsInput {
	sessions: SessionSettingsDto;
}

export interface UpdateSessionSettingsResponse {
	sessions: SessionSettingsDto;
}
