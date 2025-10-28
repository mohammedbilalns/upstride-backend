import { PipelineStage, Types } from "mongoose";

export const buildSuggestionPipeline = ( expertiseIds: string[], skillIds: string[], followedMentorIds: string[],   skip: number , limit: number = 10) => {

  const pipeline: PipelineStage[] = [
    // Match active, approved mentors not followed by user
    {
      $match: {
        _id: { $nin: followedMentorIds },
        isPending: false,
        isRejected: false,
        isActive: true,
      },
    },
    // Add match score based on expertise and skills
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
    // Calculate total match score (expertise is worth more)
    {
      $addFields: {
        matchScore: {
          $add: [
            { $multiply: ["$expertiseMatch", 3] }, // Expertise worth 3 points
            "$skillMatchCount", // Each skill worth 1 point
          ],
        },
      },
    },
    // Only include mentors with at least some match
    {
      $match: {
        matchScore: { $gt: 0 },
      },
    },
    // Sort by match score and followers
    {
      $sort: {
        matchScore: -1,
        followers: -1,
      },
    },
    // Populate expertise
    {
      $lookup: {
        from: "expertises",
        localField: "expertiseId",
        foreignField: "_id",
        as: "expertise",
      },
    },
    {
      $unwind: "$expertise",
    },
    // Populate skills
    {
      $lookup: {
        from: "skills",
        localField: "skillIds",
        foreignField: "_id",
        as: "skills",
      },
    },
    // Populate user details
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    // Project only needed fields
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
    // Facet for pagination
    {
      $facet: {
        mentors: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ] as PipelineStage[];

  return pipeline;

}
