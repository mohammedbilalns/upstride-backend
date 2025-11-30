import { type FilterQuery, type PipelineStage, Types } from "mongoose";
import type { findAllMentorsDto } from "../../../application/dtos";
import { AppError } from "../../../application/errors/AppError";
import { ErrorMessage, HttpStatus } from "../../../common/enums";
import type { Mentor } from "../../../domain/entities/mentor.entity";
import type { IMentorRepository } from "../../../domain/repositories";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { BaseRepository } from "./base.repository";
import { isPopulatedDocument } from "../utils/common";
import { ConnectionModel } from "../models/connection.model";
import { type IMentor, mentorModel } from "../models/mentor.model";
import { buildSuggestionPipeline } from "../utils/buildSuggestionPipeline";
import { checkObjectId } from "../utils/checkObjectId";

export class MentorRepository
	extends BaseRepository<Mentor, IMentor>
	implements IMentorRepository
{
	constructor() {
		super(mentorModel);
	}

	private createSearchCondition(query?: string) {
		if (!query) return {};

		return {
			$or: [
				{ bio: { $regex: query, $options: "i" } },
				{ currentRole: { $regex: query, $options: "i" } },
				{ educationalQualifications: { $regex: query, $options: "i" } },
				{ personalWebsite: { $regex: query, $options: "i" } },
			],
		};
	}

	protected mapToDomain(doc: IMentor): Mentor {
		if (
			(doc.userId && isPopulatedDocument(doc.userId)) ||
			(doc.expertiseId && isPopulatedDocument(doc.expertiseId)) ||
			(doc.skillIds &&
				Array.isArray(doc.skillIds) &&
				doc.skillIds.length > 0 &&
				isPopulatedDocument(doc.skillIds[0]))
		) {
			const mentorObj: any = {
				id: doc._id?.toString() || doc.id,
				bio: doc.bio,
				currentRole: doc.currentRole,
				organisation: doc.organisation,
				yearsOfExperience: doc.yearsOfExperience,
				educationalQualifications: doc.educationalQualifications,
				personalWebsite: doc.personalWebsite,
				resumeId: doc.resumeId,
				isPending: doc.isPending,
				isRejected: doc.isRejected,
				isActive: doc.isActive,
				createdAt: doc.createdAt,
				followers: doc.followers,
			};

			// Add populated user data if available
			if (doc.userId && isPopulatedDocument(doc.userId)) {
				mentorObj.user = {
					id: (doc.userId as any)._id?.toString() || doc.userId,
					name: (doc.userId as any).name,
					email: (doc.userId as any).email,
					profilePicture: (doc.userId as any).profilePicture,
				};
			} else {
				mentorObj.userId = doc.userId?.toString() || doc.userId;
			}

			if (doc.expertiseId && isPopulatedDocument(doc.expertiseId)) {
				mentorObj.expertise = {
					id: (doc.expertiseId as any)._id?.toString() || doc.expertiseId,
					name: (doc.expertiseId as any).name,
				};
			} else {
				mentorObj.expertiseId = doc.expertiseId?.toString() || doc.expertiseId;
			}

			if (
				doc.skillIds &&
				Array.isArray(doc.skillIds) &&
				doc.skillIds.length > 0 &&
				isPopulatedDocument(doc.skillIds[0])
			) {
				mentorObj.skills = (doc.skillIds as any[]).map((skill) => ({
					id: skill._id?.toString() || skill,
					name: skill.name,
				}));
			} else {
				mentorObj.skillIds = Array.isArray(doc.skillIds)
					? doc.skillIds.map((id) => id?.toString() || id)
					: doc.skillIds;
			}

			return mentorObj as Mentor;
		} else {
			if (doc && typeof doc.toObject === "function") {
				const mapped = mapMongoDocument(doc)!;
				return {
					id: mapped.id,
					userId: mapped.userId,
					bio: mapped.bio,
					currentRole: mapped.currentRole,
					organisation: mapped.organisation,
					yearsOfExperience: mapped.yearsOfExperience,
					educationalQualifications: mapped.educationalQualifications,
					personalWebsite: mapped.personalWebsite,
					expertiseId: mapped.expertiseId,
					skillIds: mapped.skillIds,
					resumeId: mapped.resumeId,
					isPending: mapped.isPending,
					termsAccepted: mapped.termsAccepted,
					isRejected: mapped.isRejected,
					isActive: mapped.isActive,
					followers: mapped.followers,
				};
			} else {
				return {
					id: doc._id?.toString() || doc.id,
					userId: doc.userId,
					bio: doc.bio,
					currentRole: doc.currentRole,
					organisation: doc.organisation,
					yearsOfExperience: doc.yearsOfExperience,
					educationalQualifications: doc.educationalQualifications,
					personalWebsite: doc.personalWebsite,
					expertiseId: doc.expertiseId,
					skillIds: doc.skillIds,
					resumeId: doc.resumeId,
					isPending: doc.isPending,
					isRejected: doc.isRejected,
					termsAccepted: doc.termsAccepted,
					isActive: doc.isActive,
					followers: doc.followers,
				};
			}
		}
	}

	async findAll(params: findAllMentorsDto): Promise<Mentor[]> {
		const { page, limit, query, status } = params;
		const searchCondition = this.createSearchCondition(query);

		let statusCondition: Record<string, any> = {};
		if (status) {
			if (status === "pending") {
				statusCondition = { isPending: true };
			} else if (status === "approved") {
				statusCondition = { isPending: false, isRejected: false };
			} else if (status === "rejected") {
				statusCondition = { isRejected: true };
			}
		}

		const finalCondition =
			Object.keys(searchCondition).length > 0 ||
			Object.keys(statusCondition).length > 0
				? { $and: [searchCondition, statusCondition] }
				: {};

		const docs = await this._model
			.find(finalCondition)
			.populate("userId", "name email")
			.populate("expertiseId", "name")
			.populate("skillIds", "name")
			.skip((page - 1) * limit)
			.limit(limit)
			.exec();

		return docs.map((doc) => this.mapToDomain(doc));
	}

	async count(query?: string, status?: string): Promise<number> {
		const searchCondition = this.createSearchCondition(query);

		// Status filter mapping
		let statusCondition: Record<string, any> = {};
		if (status) {
			if (status === "pending") {
				statusCondition = { isPending: true };
			} else if (status === "approved") {
				statusCondition = { isPending: false, isRejected: false };
			} else if (status === "rejected") {
				statusCondition = { isRejected: true };
			}
		}

		const finalCondition =
			Object.keys(searchCondition).length > 0 ||
			Object.keys(statusCondition).length > 0
				? { $and: [searchCondition, statusCondition] }
				: {};

		return this._model.countDocuments(finalCondition);
	}

	async findByUserId(
		userId: string,
		populate?: boolean,
		forDashboard?: boolean,
	): Promise<Mentor | null> {
		checkObjectId(userId, ErrorMessage.USER_NOT_FOUND);
		let query = this._model.findOne({ userId });

		if (forDashboard) {
			query.select("-resumeId -isPending -isRejected -isActive");
		}
		if (populate) {
			query = query.populate([
				{ path: "userId", select: "name profilePicture role email" },
				{ path: "expertiseId", select: "name _id" },
				{ path: "skillIds", select: "name _id" },
			]);
		}
		const mentor = await query;
		return mentor ? this.mapToDomain(mentor) : null;
	}

	async findByExpertiseandSkill(
		page: number,
		limit: number,
		userId: string,
		expertiseId?: string,
		skillId?: string,
		query?: string,
	): Promise<{ mentors: Mentor[]; total: number }> {
		checkObjectId(userId, ErrorMessage.USER_NOT_FOUND);
		const existingConnections = await ConnectionModel.find({
			followerId: userId,
		})
			.select("mentorId")
			.lean();

		const connectedMentorIds = existingConnections.map((conn) => conn.mentorId);

		const searchCondition = this.createSearchCondition(query);
		const baseCondition: FilterQuery<Mentor> = {
			_id: { $nin: connectedMentorIds },
			userId: { $ne: userId },
			isPending: false,
			isRejected: false,
		};
		if (expertiseId) {
			if (!Types.ObjectId.isValid(expertiseId)) {
				throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
			}
			baseCondition.expertiseId = expertiseId;
		}
		if (skillId) {
			if (!Types.ObjectId.isValid(skillId)) {
				throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST);
			}
			baseCondition.skillIds = skillId;
		}

		const finalCondition = query
			? { $and: [baseCondition, searchCondition] }
			: baseCondition;

		const [docs, total] = await Promise.all([
			this._model
				.find(finalCondition)
				.select("expertiseId skillIds bio yearsOfExperience userId")
				.populate({
					path: "userId",
					select: "name email profilePicture",
					model: "User",
				})
				.populate({
					path: "expertiseId",
					select: "name",
				})
				.populate("skillIds", "name")
				.skip((page - 1) * limit)
				.limit(limit)
				.exec(),
			this._model.countDocuments(finalCondition),
		]);
		return { mentors: docs.map((doc) => this.mapToDomain(doc)), total };
	}

	async findByExpertiseId(expertiseId: string): Promise<Mentor[]> {
		const mentors = await this._model.aggregate([
			{
				$match: {
					expertiseId: new Types.ObjectId(expertiseId),
					isActive: true,
				},
			},
			{
				$sample: {
					size: 10,
				},
			},
		]);
		return mentors.map((doc) => this.mapToDomain(doc));
	}

	async findActiveExpertisesAndSkills(): Promise<{
		expertises: string[];
		skills: string[];
	}> {
		const result = await this._model.aggregate([
			{
				$match: {
					isActive: true,
					isRejected: false,
					isPending: false,
				},
			},
			{
				$facet: {
					expertises: [
						{ $group: { _id: "$expertiseId" } },
						{
							$lookup: {
								from: "expertise",
								localField: "_id",
								foreignField: "_id",
								as: "expertise",
							},
						},
						{ $unwind: "$expertise" },
						{ $match: { "expertise.isVerified": true } },
						{ $replaceRoot: { newRoot: "$expertise" } },
					],
					skills: [
						{ $unwind: "$skillIds" },
						{ $group: { _id: "$skillIds" } },
						{
							$lookup: {
								from: "skills",
								localField: "_id",
								foreignField: "_id",
								as: "skill",
							},
						},
						{ $unwind: "$skill" },
						{ $match: { "skill.isVerified": true } },
						{ $replaceRoot: { newRoot: "$skill" } },
						{ $limit: 30 },
					],
				},
			},
		]);

		const { expertises, skills } = result[0];
		const expertisesData = expertises.map(
			(expertise: { _id: string; name: string }) => ({
				id: expertise._id,
				name: expertise.name,
			}),
		);
		const skillsData = skills.map((skill: { _id: string; name: string }) => ({
			id: skill._id,
			name: skill.name,
		}));
		return { expertises: expertisesData, skills: skillsData };
	}

	async fetchSuggestedMentors(
		userId: string,
		expertiseIds: string[],
		skillIds: string[],
		page: number = 1,
		limit: number = 10,
	): Promise<{ mentors: any[] }> {
		checkObjectId(userId, ErrorMessage.USER_NOT_FOUND);
		skillIds.forEach((skillId) =>
			checkObjectId(skillId, ErrorMessage.SKILL_NOT_FOUND),
		);
		const skip = (page - 1) * limit;

		const followedMentors = await ConnectionModel.find({
			followerId: new Types.ObjectId(userId),
		}).select("mentorId");

		const followedMentorIds = followedMentors.map((conn) =>
			conn.mentorId.toString(),
		);

		const pipeline: PipelineStage[] = buildSuggestionPipeline(
			expertiseIds,
			skillIds,
			followedMentorIds,
			skip,
			limit,
		);
		const result = await this._model.aggregate(pipeline);

		const mentors = result[0]?.mentors || [];

		return {
			mentors: mentors.map((mentor: any) => ({
				id: mentor._id.toString(),
				userId: mentor.userId.toString(),
				bio: mentor.bio,
				expertise: {
					_id: mentor.expertise._id.toString(),
					name: mentor.expertise.name,
				},
				user: {
					id: mentor.user._id.toString(),
					name: mentor.user.name,
					profilePicture: mentor.user.profilePicture,
				},
			})),
		};
	}

	async findByMentorId(mentorId: string): Promise<Mentor | null> {
		checkObjectId(mentorId, ErrorMessage.MENTOR_NOT_FOUND);
		const mentor = await this._model
			.findOne({ _id: mentorId, isPending: false, isRejected: false })
			.populate("userId", "name email profilePicture")
			.populate("expertiseId", "name")
			.populate("skillIds", "name")
			.select("-resumeId -blockingReason -isPending -isRejected -isActive");
		return mentor ? this.mapToDomain(mentor) : null;
	}
}
