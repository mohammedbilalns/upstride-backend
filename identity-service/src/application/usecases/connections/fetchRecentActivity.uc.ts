import { IConnectionRepository } from "../../../domain/repositories/connection.repository.interface";
import { IFetchRecentActivityUC } from "../../../domain/useCases/fetchRecentActivity.uc.interface";
import { Activity, PopulatedConnection } from "../../dtos/connection.dto";

export class FetchRecentActivityUC implements IFetchRecentActivityUC {
	constructor(private _connectionRepository: IConnectionRepository) {}

	async execute(userId: string): Promise<Activity[]> {
		const recentActivities: PopulatedConnection[] =
			await this._connectionRepository.fetchRecentActivity(userId);

		const transformedActivities: Activity[] = recentActivities.map(
			(activity: PopulatedConnection) => {
				if (activity.mentorId._id.toString() === userId) {
					return {
						id: activity._id.toString(),
						activityType: "followed_you",
						userName: activity.followerId.name,
						avatarImage: activity.followerId.profilePicture || "",
						createdAt: activity.createdAt,
					};
				} else {
					return {
						id: activity._id.toString(),
						activityType: "followed_user",
						userName: activity.mentorId.userId.name,
						avatarImage: activity.mentorId.userId.profilePicture || "",
						createdAt: activity.createdAt,
					};
				}
			},
		);

		return transformedActivities;
	}
}
