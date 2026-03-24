import type {
	ContentSettingsDto,
	EconomySettingsDto,
	MentorSettingsDto,
	SessionSettingsDto,
} from "./platform-settings.types.dto";

export interface FetchPlatformSettingsResponse {
	economy: EconomySettingsDto;
	mentors: MentorSettingsDto;
	content: ContentSettingsDto;
	sessions: SessionSettingsDto;
}
