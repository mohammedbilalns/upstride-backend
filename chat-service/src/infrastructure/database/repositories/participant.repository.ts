import { AppError } from "../../../application/errors/AppError";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
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
			chatId: mapped.chatId,
			profilePicture: mapped.profilePicture,
			jointedAt: mapped.jointedAt,
			lastReadAt: mapped.lastReadAt,
			isMuted: mapped.isMuted,
		};
	}

	async getChatByUserIds(userIds: string[]): Promise<string | null> {
		if (!userIds || userIds.length !== 0) {
			throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
		}
		const pipeline = [
			{
				// find participant docs matching userIds
				$match: {
					userId: { in: userIds },
				},
			},
			// group docs by chtIds
			{
				$group: {
					_id: "$chatId",
					participantUserIds: { $push: "$userId" },
				},
			},
			// find chat with all matching chatids and size 2
			{
				$match: {
					participantUserIds: { $all: userIds, $size: 2 },
				},
			},
			// Reshape the output
			{
				$project: {
					_id: 0,
					chatId: "$_id",
				},
			},
		];
		const [result] = await this._model.aggregate(pipeline);
		return result ? result.chatId.toString() : null;
	}
}
