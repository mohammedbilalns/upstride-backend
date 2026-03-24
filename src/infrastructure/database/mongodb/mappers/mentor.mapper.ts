import { Types } from "mongoose";
import { Mentor } from "../../../../domain/entities/mentor.entity";
import type { MentorDocument } from "../models/mentor.model";
import { toIdString } from "../utils/id.util";

export class MentorMapper {
	static toDomain(doc: MentorDocument): Mentor {
		return new Mentor(
			toIdString(doc._id),
			toIdString(doc.userId),
			doc.bio,
			toIdString(doc.currentRoleId),
			doc.organization,
			doc.yearsOfExperience,
			doc.score ?? 0,
			doc.tierName ?? null,
			doc.tierMax30minPayment ?? null,
			doc.currentPricePer30Min ?? null,
			doc.personalWebsite || null,
			doc.resumeId,
			doc.educationalQualifications,
			doc.areasOfExpertise.map((id) => toIdString(id)),
			doc.toolsAndSkills.map((ts) => ({
				skillId: toIdString(ts.skillId),
				level: ts.level,
			})),
			doc.experience.map((exp) => ({
				company: exp.company,
				role: toIdString(exp.role),
				description: exp.description,
				from: exp.from,
				to: exp.to || null,
			})),
			doc.isApproved,
			doc.applicationAttempts,
			doc.isRejected,
			doc.createdAt,
			doc.updatedAt,
			doc.rejectionReason,
			doc.avgRating ?? 0,
		);
	}

	static toDocument(entity: Mentor): Partial<MentorDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
			bio: entity.bio,
			currentRoleId: new Types.ObjectId(entity.currentRoleId),
			organization: entity.organization,
			yearsOfExperience: entity.yearsOfExperience,
			score: entity.score,
			tierName: entity.tierName ?? undefined,
			tierMax30minPayment: entity.tierMax30minPayment ?? undefined,
			currentPricePer30Min: entity.currentPricePer30Min ?? undefined,
			personalWebsite: entity.personalWebsite ?? undefined,
			resumeId: entity.resumeId,
			educationalQualifications: entity.educationalQualifications,
			areasOfExpertise: entity.areasOfExpertise.map(
				(id) => new Types.ObjectId(id),
			),
			toolsAndSkills: entity.toolsAndSkills.map((ts) => ({
				skillId: new Types.ObjectId(ts.skillId),
				level: ts.level,
			})),
			experience: entity.experience.map((exp) => ({
				company: exp.company,
				role: new Types.ObjectId(exp.role),
				description: exp.description,
				from: exp.from,
				to: exp.to,
			})),
			isApproved: entity.isApproved,
			isRejected: entity.isRejected,
			applicationAttempts: entity.applicationAttempts,
			rejectionReason: entity.rejectionReason,
			avgRating: entity.avgRating,
		};
	}
}
