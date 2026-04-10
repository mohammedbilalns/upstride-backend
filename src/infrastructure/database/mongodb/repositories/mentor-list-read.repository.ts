import { injectable } from "inversify";
import type { PipelineStage, QueryFilter } from "mongoose";
import { Types } from "mongoose";
import type { Mentor } from "../../../../domain/entities/mentor.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities/paginatable.repository.interface";
import type {
	MentorApplicationDetails,
	MentorDiscoveryDetails,
	MentorDiscoveryQuery,
	MentorQuery,
} from "../../../../domain/repositories/mentor.repository.types";
import type { IMentorListReadRepository } from "../../../../domain/repositories/mentor-list-read.repository.interface";
import { MentorMapper } from "../mappers/mentor.mapper";
import { buildMentorDiscoveryDetails } from "../mappers/mentor-details.mapper";
import { InterestModel } from "../models/interests.model";
import { type MentorDocument, MentorModel } from "../models/mentor.model";
import { ProfessionModel } from "../models/profession.model";
import { SkillModel } from "../models/skill.model";
import { UserModel } from "../models/user.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoMentorListReadRepository
	extends AbstractMongoRepository<Mentor, MentorDocument>
	implements IMentorListReadRepository
{
	constructor() {
		super(MentorModel);
	}

	protected toDomain(doc: MentorDocument): Mentor {
		return MentorMapper.toDomain(doc);
	}

	protected toDocument(entity: Mentor): Partial<MentorDocument> {
		return MentorMapper.toDocument(entity);
	}

	async paginate({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<MentorQuery>): Promise<
		PaginatedResult<MentorApplicationDetails>
	> {
		const filter: QueryFilter<MentorDocument> = {};

		if (query?.isApproved !== undefined) {
			filter.isApproved = query.isApproved;
		}

		if (query?.isRejected !== undefined) {
			filter.isRejected = query.isRejected;
		}

		if (query?.userId) {
			filter.userId = query.userId;
		}

		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this.model
				.find(filter)
				.sort(sort ?? { createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.populate("userId", "name email profilePictureId")
				.populate("currentRoleId", "name")
				.populate("areasOfExpertise", "name")
				.populate("toolsAndSkills.skillId", "name interestId")
				.lean(),
			this.model.countDocuments(filter),
		]);

		const items = docs.map((doc: MentorDocument) => {
			const mentor = this.toDomain(doc);
			return {
				...mentor,
				user: doc.userId as unknown as {
					name: string;
					email: string;
					profilePictureId?: string;
				},
				currentRoleDetails: doc.currentRoleId as unknown as { name: string },
				expertisesDetails: (doc.areasOfExpertise || []).map((e: unknown) => {
					const exp = e as unknown as {
						_id?: string;
						id?: string;
						name?: string;
					};
					return {
						id: exp._id?.toString() || exp.id?.toString(),
						name: exp.name,
					};
				}),
				skillsDetails: (doc.toolsAndSkills || []).map((ts: unknown) => {
					const skill = ts as unknown as {
						skillId?: { name?: string; interestId?: string };
						level?: string;
					};
					return {
						skillId: {
							name: skill.skillId?.name,
							interestId: skill.skillId?.interestId?.toString(),
						},
						level: skill.level,
					};
				}),
			} as MentorApplicationDetails;
		});

		return this.buildPaginatedResult<MentorApplicationDetails>(
			items,
			total,
			page,
			limit,
		);
	}

	async paginateDiscoverable({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<MentorDiscoveryQuery>): Promise<
		PaginatedResult<MentorDiscoveryDetails>
	> {
		const filter: QueryFilter<MentorDocument> = {
			isApproved: true,
			isRejected: false,
		};

		if (!query?.isAdminView) {
			filter.isUserBlocked = { $ne: true };
		}

		if (query?.excludeUserId) {
			filter.userId = { $ne: new Types.ObjectId(query.excludeUserId) };
		}

		if (query?.categoryId) {
			filter.areasOfExpertise = new Types.ObjectId(query.categoryId);
		}

		if (query?.tierName) {
			filter.tierName = query.tierName;
		}

		if (
			query?.minExperience !== undefined ||
			query?.maxExperience !== undefined
		) {
			const experienceFilter: { $gte?: number; $lte?: number } = {};
			if (query.minExperience !== undefined) {
				experienceFilter.$gte = query.minExperience;
			}
			if (query.maxExperience !== undefined) {
				experienceFilter.$lte = query.maxExperience;
			}
			filter.yearsOfExperience = experienceFilter;
		}

		const skip = (page - 1) * limit;
		const userCollection = UserModel.collection.name;
		const professionCollection = ProfessionModel.collection.name;
		const interestCollection = InterestModel.collection.name;
		const skillCollection = SkillModel.collection.name;

		const pipeline: PipelineStage[] = [
			{ $match: filter } as PipelineStage.Match,
			{
				$lookup: {
					from: userCollection,
					localField: "userId",
					foreignField: "_id",
					as: "user",
				},
			} as PipelineStage.Lookup,
			{ $unwind: "$user" } as PipelineStage.Unwind,
		];

		if (query?.search) {
			pipeline.push({
				$match: { "user.name": { $regex: query.search, $options: "i" } },
			} as PipelineStage.Match);
		}

		pipeline.push(
			{
				$lookup: {
					from: professionCollection,
					localField: "currentRoleId",
					foreignField: "_id",
					as: "currentRole",
				},
			} as PipelineStage.Lookup,
			{
				$lookup: {
					from: interestCollection,
					localField: "areasOfExpertise",
					foreignField: "_id",
					as: "areasOfExpertise",
				},
			} as PipelineStage.Lookup,
			{
				$lookup: {
					from: skillCollection,
					let: { skillIds: "$toolsAndSkills.skillId" },
					pipeline: [
						{
							$match: {
								$expr: { $in: ["$_id", "$$skillIds"] },
							},
						},
						{ $project: { name: 1 } },
					],
					as: "skills",
				},
			} as PipelineStage.Lookup,
			{
				$addFields: {
					userId: "$user",
					currentRoleId: { $arrayElemAt: ["$currentRole", 0] },
					toolsAndSkills: {
						$map: {
							input: "$toolsAndSkills",
							as: "ts",
							in: {
								skillId: {
									$arrayElemAt: [
										{
											$filter: {
												input: "$skills",
												as: "skill",
												cond: { $eq: ["$$skill._id", "$$ts.skillId"] },
											},
										},
										0,
									],
								},
								level: "$$ts.level",
							},
						},
					},
				},
			} as PipelineStage.AddFields,
			{
				$project: {
					user: 0,
					currentRole: 0,
					skills: 0,
				},
			} as PipelineStage.Project,
		);

		const [result] = await this.model.aggregate([
			...pipeline,
			{ $sort: sort ?? { avgRating: -1, createdAt: -1 } } as PipelineStage.Sort,
			{
				$facet: {
					items: [{ $skip: skip }, { $limit: limit }],
					total: [{ $count: "count" }],
				},
			} as PipelineStage.Facet,
		]);

		const docs = (result?.items ?? []) as MentorDocument[];
		const total = (result?.total?.[0]?.count ?? 0) as number;

		const items = docs.map((doc: MentorDocument) =>
			buildMentorDiscoveryDetails(doc),
		);

		return this.buildPaginatedResult(items, total, page, limit);
	}
	async findUserIdsByExpertise(interestId: string): Promise<string[]> {
		const result = await this.model
			.find({ areasOfExpertise: new Types.ObjectId(interestId) })
			.select("userId")
			.lean()
			.exec();

		return result.map((doc) => doc.userId.toString());
	}
}
