import { NotFoundError } from "../../../shared/errors/not-found-error";

type PlatformSettingsType = "session" | "mentor" | "coin" | "content";

export class PlatformSettingsNotFoundError extends NotFoundError {
	constructor(type: PlatformSettingsType) {
		super(`Platform ${type} settings not found`);
	}
}
