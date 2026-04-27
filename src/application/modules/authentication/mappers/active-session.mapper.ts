import type { Session } from "../../../../domain/entities/session.entity";
import type { ActiveSessionDTO } from "../dtos";

export class ActiveSessionMapper {
	static toDTO(session: Session, currentSessionId: string): ActiveSessionDTO {
		return {
			id: session.sid,
			ip: session.ipAddress,
			deviceName: session.deviceName,
			deviceType: session.deviceType,
			lastUsedAt: session.lastUsedAt,
			isCurrent: session.sid === currentSessionId,
		};
	}

	static toDTOs(
		sessions: Session[],
		currentSessionId: string,
	): ActiveSessionDTO[] {
		return sessions
			.filter((s) => !s.revoked && s.sid !== currentSessionId)
			.map((session) => ActiveSessionMapper.toDTO(session, currentSessionId))
			.sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime());
	}
}
