import { HttpStatus, ResponseMessage } from "../../../common/enums";
import logger from "../../../common/utils/logger";
import type { IConnectionService } from "../../../domain/services/connection.service.interface";
import asyncHandler from "../utils/asyncHandler";
import {
	followMentorSchema,
	unfollowMentorSchema,
} from "../validations/connections.validation";
import { paginationQuerySchema } from "../validations/pagination.validation";

export class ConnectionController {
	constructor(private _connectionService: IConnectionService) {}

	followMentor = asyncHandler(async (req, res) => {
		const { mentorId } = followMentorSchema.parse(req.body);
		const userId = res.locals.user.id;

		await this._connectionService.follow(userId, mentorId);
		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.FOLLOWED_MENTOR });
	});

	unfollowMentor = asyncHandler(async (req, res) => {
		const userId = res.locals.user.id;
		const { mentorId } = unfollowMentorSchema.parse(req.body);
		await this._connectionService.unfollow(userId, mentorId);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.UNFOLLOWED_MENTOR });
	});

	fetchFollowers = asyncHandler(async (req, res) => {
		const { page, limit } = paginationQuerySchema.parse(req.query);
		const userId = res.locals.user.id;
		const data = await this._connectionService.fetchFollowers(
			userId,
			page,
			limit,
		);
		res.status(HttpStatus.OK).send(data);
	});

	fetchFollowing = asyncHandler(async (req, res) => {
		const { page, limit } = paginationQuerySchema.parse(req.query);
		const userId = res.locals.user.id;

		const data = await this._connectionService.fetchFollowing(
			userId,
			page,
			limit,
		);
		res.status(HttpStatus.OK).send(data);
	});

  fetchRecentActivity = asyncHandler(async (_req, res) => {
    const userId = res.locals.user.id;
    const activities = await this._connectionService.fetchRecentActivity(userId);
    res.status(HttpStatus.OK).send(activities);
  });

  fetchSuggestedMentors = asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    logger.debug(`fetchSuggestedMentors userId: ${userId}`);
    const {page, limit} = paginationQuerySchema.parse(req.query);
    const mentors = await this._connectionService.fetchSuggestedMentors(userId,page,limit);
    logger.debug(`fetchSuggestedMentors mentors: ${mentors}`);
    res.status(HttpStatus.OK).send(mentors);
  });

  fetchMutualConnections = asyncHandler(async (_req, res) => {
    const userId = res.locals.user.id;
    const mentors = await this._connectionService.fetchMutualConnections(userId);
    res.status(HttpStatus.OK).send(mentors);
  });

  
}
