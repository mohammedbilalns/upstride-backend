import { HttpStatus, ResponseMessage } from "../../../common/enums";
import {
	IFetchFollowersUC,
	IFetchFollowingUC,
	IFetchMutualConnectionsUC,
	IFetchRecentActivityUC,
	IFetchSuggestedMentorsUC,
	IFollowMentorUC,
	IUnfollowMentorUC,
} from "../../../domain/useCases";
import asyncHandler from "../utils/asyncHandler";
import {
	followMentorSchema,
	unfollowMentorSchema,
} from "../validations/connections.validation";
import { paginationQuerySchema } from "../validations/pagination.validation";

export class ConnectionController {
	constructor(
		private _followMentorUC: IFollowMentorUC,
		private _unfollowMentorUC: IUnfollowMentorUC,
		private _fetchFollowersUC: IFetchFollowersUC,
		private _fetchfollowingUC: IFetchFollowingUC,
		private _fetchMutualConnectionsUC: IFetchMutualConnectionsUC,
		private _fetchrecentActivity: IFetchRecentActivityUC,
		private _fetchSuggestedMentorsUC: IFetchSuggestedMentorsUC,
	) {}

	followMentor = asyncHandler(async (req, res) => {
		const { mentorId } = followMentorSchema.parse(req.body);
		const userId = res.locals.user.id;

		await this._followMentorUC.execute(userId, mentorId);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.FOLLOWED_MENTOR });
	});

	unfollowMentor = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { mentorId } = unfollowMentorSchema.parse(req.body);
		await this._unfollowMentorUC.execute(userId, mentorId);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.UNFOLLOWED_MENTOR });
	});

	fetchFollowers = asyncHandler(async (req, res) => {
		const { page, limit } = paginationQuerySchema.parse(req.query);
		const userId = res.locals.user.id;
		const data = await this._fetchFollowersUC.execute(userId, page, limit);
		res.status(HttpStatus.OK).send(data);
	});

	fetchFollowing = asyncHandler(async (req, res) => {
		const { page, limit } = paginationQuerySchema.parse(req.query);
		const userId = res.locals.user.id;

		const data = await this._fetchfollowingUC.execute(userId, page, limit);
		res.status(HttpStatus.OK).send(data);
	});

	fetchRecentActivity = asyncHandler(async (_req, res) => {
		const userId = res.locals.user.id;
		const activities = await this._fetchrecentActivity.execute(userId);
		res.status(HttpStatus.OK).send(activities);
	});

	fetchSuggestedMentors = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { page, limit } = paginationQuerySchema.parse(req.query);
		const mentors = await this._fetchSuggestedMentorsUC.execute(
			userId,
			page,
			limit,
		);
		res.status(HttpStatus.OK).send(mentors);
	});

	fetchMutualConnections = asyncHandler(async (_req, res) => {
		const userId = res.locals.user.id;
		const mentors = await this._fetchMutualConnectionsUC.execute(userId);
		res.status(HttpStatus.OK).send(mentors);
	});
}
