import { FilterQuery, type ObjectId, Types } from "mongoose";
import type { findAllMentorsDto } from "../../../application/dtos";
import type { Mentor } from "../../../domain/entities/mentor.entity";
import type { IMentorRepository } from "../../../domain/repositories";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { type IMentor, mentorModel } from "../models/mentor.model";
import { BaseRepository } from "./base.repository";
import { ConnectionModel } from "../models/connection.model";
import logger from "../../../common/utils/logger";
import { AppError } from "../../../application/errors/AppError";
import { ErrorMessage, HttpStatus } from "../../../common/enums";

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

	//  function to check if a value is an ObjectId
	private isObjectId(value: any): value is ObjectId {
		return (
			value &&
				typeof value === "object" &&
				value.constructor.name === "ObjectId"
		);
	}

	// Helper function to check if a value is a populated document
	private isPopulatedDocument(value: any): boolean {
		return (
			value &&
				typeof value === "object" &&
				!this.isObjectId(value) &&
				"_id" in value
		);
	}

	protected mapToDomain(doc: IMentor): Mentor {
		if (
			(doc.userId && this.isPopulatedDocument(doc.userId)) ||
				(doc.expertiseId && this.isPopulatedDocument(doc.expertiseId)) ||
				(doc.skillIds &&
					Array.isArray(doc.skillIds) &&
					doc.skillIds.length > 0 &&
					this.isPopulatedDocument(doc.skillIds[0]))
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
			};

			// Add populated user data if available
			if (doc.userId && this.isPopulatedDocument(doc.userId)) {
				mentorObj.user = {
					id: (doc.userId as any)._id?.toString() || doc.userId,
					name: (doc.userId as any).name,
					email: (doc.userId as any).email,
				};
			} else {
				mentorObj.userId = doc.userId?.toString() || doc.userId;
			}

			if (doc.expertiseId && this.isPopulatedDocument(doc.expertiseId)) {
				mentorObj.expertise = {
					id: (doc.expertiseId as any)._id?.toString() || doc.expertiseId,
					name: (doc.expertiseId as any).name,
				};
			} else {
				mentorObj.expertiseId = doc.expertiseId?.toString() || doc.expertiseId;
			}

			// Add populated skills data if available
			if (
				doc.skillIds &&
					Array.isArray(doc.skillIds) &&
					doc.skillIds.length > 0 &&
					this.isPopulatedDocument(doc.skillIds[0])
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
	): Promise<Mentor | null> {
		let query = this._model.findOne({ userId });
		if (populate) {
			query = query.populate([
				{ path: "expertiseId", select: "name _id" },
				{ path: "skillIds", select: "name _id" },
			]);
		}
		const mentor = await query;
		return mentor ? this.mapToDomain(mentor) : null;
	}

	async findByExpertiseandSkill(
		expertiseId: string,
		skillId: string,
		userId: string,
		page: number,
		limit: number,
		query?: string,

	): Promise<{mentors: Mentor[], total: number}> {

		const existingConnections = await ConnectionModel.find({
			followerId: userId
		}).select('mentorId').lean();


		const connectedMentorIds = existingConnections.map(conn => conn.mentorId);

		const searchCondition = this.createSearchCondition(query);
		const baseCondition: FilterQuery<Mentor> = { 
			_id: { $nin: connectedMentorIds }, 
			userId: { $ne: userId }, 
			isPending: false,
			isRejected: false,
		};
		if(expertiseId){
			if(!Types.ObjectId.isValid(expertiseId)){
				throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST)
			}
			baseCondition.expertiseId = expertiseId
		}
		if(skillId){
			if(!Types.ObjectId.isValid(skillId)){
				throw new AppError(ErrorMessage.INVALID_INPUT, HttpStatus.BAD_REQUEST)
			}
			baseCondition.skillIds = skillId
		}

		const finalCondition = query
			? { $and: [baseCondition, searchCondition] }
			: baseCondition;

		const [docs, total] = await Promise.all( [this._model
			.find(finalCondition)
			.populate("userId", "name email")
			.populate("expertiseId", "name")
			.populate("skillIds", "name")
			.skip(page * limit)
			.limit(limit)
			.exec(),
			this._model.countDocuments(finalCondition)
		]) 
		logger.debug("mentors"+ docs)
		return {mentors: docs.map((doc) => this.mapToDomain(doc)), total};	
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

	async findActiveExpertisesAndSkills(): Promise<{expertises: string[], skills: string[]}> {
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
		const expertisesData = expertises.map((expertise:{_id: string, name: string}) => ({id: expertise._id, name: expertise.name}))
		const skillsData = skills.map((skill:{_id: string, name: string}) => ({id: skill._id, name: skill.name}))
		return { expertises: expertisesData, skills: skillsData };
	}


}
