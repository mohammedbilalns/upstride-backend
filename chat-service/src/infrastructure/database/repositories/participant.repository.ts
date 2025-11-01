import { Participant } from "../../../domain/entities/participant.entity";
import { IParticipantRepository } from "../../../domain/repositories/participant.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { IParticipant, ParticipantModel } from "../models/participant.model";
import { BaseRepository } from "./base.repository";

export class ParticipantRepository
	extends BaseRepository<Participant, IParticipant>
	implements IParticipantRepository
{
	constructor() {
		super(ParticipantModel);
	}

	protected mapToDomain(doc: IParticipant): Participant {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			name: mapped.name,
			userId: mapped.userId,
			role: mapped.role,
			jointedAt: mapped.jointedAt,
			lastReadAt: mapped.lastReadAt,
			isMuted: mapped.isMuted,
		};
	}
}
