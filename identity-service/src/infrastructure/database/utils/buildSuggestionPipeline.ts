import { PipelineStage, Types } from "mongoose";

export const buildSuggestionPipeline = (
	expertiseIds: string[],
	skillIds: string[],
	followedMentorIds: string[],
	skip: number,
	limit: number = 10,
) => {
	const pipeline: PipelineStage[] = [
		{
			$match: {
				_id: { $nin: followedMentorIds.map((id) => new Types.ObjectId(id)) },
				isPending: false,
				isRejected: false,
				isActive: true,
			},
		},
		{
			$addFields: {
				expertiseMatch: {
					$cond: [
						{
							$in: [
								"$expertiseId",
								expertiseIds.map((id) => new Types.ObjectId(id)),
							],
						},
						1,
						0,
					],
				},
				skillMatchCount: {
					$size: {
						$setIntersection: [
							"$skillIds",
							skillIds.map((id) => new Types.ObjectId(id)),
						],
					},
				},
			},
		},
		{
			$addFields: {
				matchScore: {
					$add: [{ $multiply: ["$expertiseMatch", 3] }, "$skillMatchCount"],
				},
			},
		},
		{
			$match: {
				matchScore: { $gt: 0 },
			},
		},
		{
			$sort: {
				matchScore: -1,
				followers: -1,
			},
		},
		{
			$lookup: {
				from: "expertise",
				localField: "expertiseId",
				foreignField: "_id",
				as: "expertise",
			},
		},
		{
			$unwind: {
				path: "$expertise",
				preserveNullAndEmptyArrays: false,
			},
		},
		{
			$lookup: {
				from: "skill",
				localField: "skillIds",
				foreignField: "_id",
				as: "skills",
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "userId",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$unwind: {
				path: "$user",
				preserveNullAndEmptyArrays: false,
			},
		},
		{
			$project: {
				_id: 1,
				userId: 1,
				bio: 1,
				currentRole: 1,
				organisation: 1,
				yearsOfExperience: 1,
				educationalQualifications: 1,
				personalWebsite: 1,
				followers: 1,
				matchScore: 1,
				expertise: {
					_id: 1,
					name: 1,
				},
				skills: {
					_id: 1,
					name: 1,
				},
				user: {
					_id: 1,
					name: 1,
					profilePicture: 1,
				},
			},
		},
		{
			$facet: {
				mentors: [{ $skip: skip }, { $limit: limit }],
				totalCount: [{ $count: "count" }],
			},
		},
	] as PipelineStage[];

	return pipeline;
};
