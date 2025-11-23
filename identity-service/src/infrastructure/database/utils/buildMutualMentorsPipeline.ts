import { type PipelineStage, Types } from "mongoose";

export function buildMutualMentorsPipeline(
	userId: string,
	userFollowedMentorIds: string[],
	limit: number,
) {
	const pipeline: PipelineStage[] = [
		{
			$match: {
				mentorId: {
					$in: userFollowedMentorIds.map((id) => new Types.ObjectId(id)),
				},
				followerId: { $ne: new Types.ObjectId(userId) },
			},
		},
		{
			$group: {
				_id: "$followerId",
				commonMentors: { $addToSet: "$mentorId" },
				commonMentorCount: { $sum: 1 },
			},
		},
		{
			$lookup: {
				from: "connections",
				localField: "_id",
				foreignField: "followerId",
				as: "theirConnections",
			},
		},
		{
			$unwind: "$theirConnections",
		},
		{
			$match: {
				"theirConnections.mentorId": {
					$nin: userFollowedMentorIds.map((id) => new Types.ObjectId(id)),
				},
			},
		},
		{
			$group: {
				_id: "$theirConnections.mentorId",
				mutualFollowerIds: { $addToSet: "$_id" },
				mutualConnectionCount: { $sum: 1 },
			},
		},
		{
			$sort: {
				mutualConnectionCount: -1,
			},
		},
		{
			$limit: limit,
		},
		{
			$lookup: {
				from: "mentors",
				localField: "_id",
				foreignField: "_id",
				as: "mentor",
			},
		},
		{
			$unwind: "$mentor",
		},
		{
			$match: {
				"mentor.isPending": false,
				"mentor.isRejected": false,
				"mentor.isActive": true,
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "mentor.userId",
				foreignField: "_id",
				as: "user",
			},
		},
		{
			$unwind: "$user",
		},
		{
			$lookup: {
				from: "expertise",
				localField: "mentor.expertiseId",
				foreignField: "_id",
				as: "expertise",
			},
		},
		{
			$unwind: "$expertise",
		},
		{
			$lookup: {
				from: "users",
				localField: "mutualFollowerIds",
				foreignField: "_id",
				as: "mutualFollowers",
			},
		},
		{
			$project: {
				_id: 1,
				mentorUserId: "$mentor.userId",
				currentRole: "$mentor.currentRole",
				organisation: "$mentor.organisation",
				yearsOfExperience: "$mentor.yearsOfExperience",
				followers: "$mentor.followers",
				mutualConnectionCount: 1,
				userName: "$user.name",
				profilePicture: "$user.profilePicture",
				expertise: {
					_id: "$expertise._id",
					name: "$expertise.name",
				},
			},
		},
		{
			$facet: {
				connections: [{ $limit: limit }],
				totalCount: [{ $count: "count" }],
			},
		},
	] as PipelineStage[];
	return pipeline;
}
