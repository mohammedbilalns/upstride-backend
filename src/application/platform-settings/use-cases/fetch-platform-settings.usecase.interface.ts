import type { FetchPlatformSettingsResponse } from "../dtos/fetch-platform-settings.dto";

export interface IFetchPlatformSettingsUseCase {
	execute(): Promise<FetchPlatformSettingsResponse>;
}
