import type {
	UpdateMentorSettingsInput,
	UpdateMentorSettingsResponse,
} from "../dtos/update-mentor-settings.dto";

export interface IUpdateMentorSettingsUseCase {
	execute(
		input: UpdateMentorSettingsInput,
	): Promise<UpdateMentorSettingsResponse>;
}
