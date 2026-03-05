import { Types } from "mongoose";
import { Mentor } from "../../../../domain/entities/mentor.entity";
import type { MentorDocument } from "../models/mentor.model";

export class MentorMapper {
	static toDomain(doc: MentorDocument): Mentor {
		return new Mentor(
			doc._id.toString(),
			doc.userId.toString(),
			doc.bio,
			doc.currentRoleId.toString(),
			doc.organization,
			doc.yearsOfExperience,
			doc.personalWebsite,
			doc.resumeId,
			doc.educationalQualifications,
			doc.areasOfExpertise.map((id) => id.toString()),
			doc.toolsAndSkills.map((ts) => ({
				skillId: ts.skillId.toString(),
				level: ts.level,
			})),
			doc.experience.map((exp) => ({
				company: exp.company,
				role: exp.role,
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
		);
	}

	static toDocument(entity: Mentor): Partial<MentorDocument> {
		return {
			userId: new Types.ObjectId(entity.userId),
			bio: entity.bio,
			currentRoleId: new Types.ObjectId(entity.currentRoleId),
			organization: entity.organization,
			yearsOfExperience: entity.yearsOfExperience,
			personalWebsite: entity.personalWebsite,
			resumeId: entity.resumeId,
			educationalQualifications: entity.educationalQualifications,
			areasOfExpertise: entity.areasOfExpertise.map(
				(id) => new Types.ObjectId(id),
			),
			toolsAndSkills: entity.toolsAndSkills.map((ts) => ({
				skillId: new Types.ObjectId(ts.skillId),
				level: ts.level,
			})),
			experience: entity.experience,
			isApproved: entity.isApproved,
			isRejected: entity.isRejected,
			applicationAttempts: entity.applicationAttempts,
			rejectionReason: entity.rejectionReason,
		};
	}
}
