import { PipelineStage, Types } from "mongoose";

export function buildMutualMentorsPipeline(userId: string, userFollowedMentorIds: string[], recentConnectedUserIds: string[], limit: number){
	const pipeline: PipelineStage[] = [
		{
			$match: {
				followerId: {
					$in: recentConnectedUserIds.map((id) => new Types.ObjectId(id)),
				},
				mentorId: {
					$nin: [
						new Types.ObjectId(userId), // Exclude user's own mentor profile
						...userFollowedMentorIds.map((id) => new Types.ObjectId(id)), // Exclude already followed
					],
				},
			},
		},
		// Group by mentorId to count mutual connections
		{
			$group: {
				_id: "$mentorId",
				mutualFollowerIds: { $addToSet: "$followerId" },
				mutualConnectionCount: { $sum: 1 },
			},
		},
		// Sort by number of mutual connections
		{
			$sort: {
				mutualConnectionCount: -1,
			},
		},
		// Limit results
		{
			$limit: limit,
		},
		// Lookup mentor details
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
		// Only include active, approved mentors
		{
			$match: {
				"mentor.isPending": false,
				"mentor.isRejected": false,
				"mentor.isActive": true,
			},
		},
		// Lookup user details for the mentor
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
		// Lookup expertise
		{
			$lookup: {
				from: "expertises",
				localField: "mentor.expertiseId",
				foreignField: "_id",
				as: "expertise",
			},
		},
		{
			$unwind: "$expertise",
		},
		// Lookup mutual follower details
		{
			$lookup: {
				from: "users",
				localField: "mutualFollowerIds",
				foreignField: "_id",
				as: "mutualFollowers",
			},
		},
		// Project final shape
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
				mutualFollowers: {
					$slice: [
						{
							$map: {
								input: "$mutualFollowers",
								as: "follower",
								in: {
									id: "$$follower._id",
									name: "$$follower.name",
									profilePicture: "$$follower.profilePicture",
								},
							},
						},
						3, // Show max 3 mutual connections
					],
				},
			},
		},
		// Get total count
		{
			$facet: {
				connections: [{ $limit: limit }],
				totalCount: [{ $count: "count" }],
			},
		},
	] as PipelineStage[];
  return pipeline;

}
