import type { ContentSettingsDto } from "./platform-settings.types.dto";

export interface UpdateContentSettingsInput {
	content: ContentSettingsDto;
}

export interface UpdateContentSettingsResponse {
	content: ContentSettingsDto;
}
