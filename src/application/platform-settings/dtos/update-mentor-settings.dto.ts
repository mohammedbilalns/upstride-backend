import type { MentorSettingsDto } from "./platform-settings.types.dto";

export interface UpdateMentorSettingsInput {
	mentors: MentorSettingsDto;
}

export interface UpdateMentorSettingsResponse {
	mentors: MentorSettingsDto;
}
