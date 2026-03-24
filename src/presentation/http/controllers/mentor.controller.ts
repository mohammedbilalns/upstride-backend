import { inject, injectable } from "inversify";
import type { GetMentorsInput } from "../../../application/modules/mentor-discovery/dtos/get-mentors.dto";
import type { IGetMentorsUseCase } from "../../../application/modules/mentor-discovery/use-cases";
import type {
	IApproveMentorUseCase,
	IGetMentorApplicationsUseCase,
	IGetMentorProfileUseCase,
	IGetMentorRegistrationInfoUseCase,
	IGetPublicMentorProfileUseCase,
	IRegisterMentorUseCase,
	IRejectMentorUseCase,
	IResubmitMentorUseCase,
	IUpdateMentorProfileUseCase,
} from "../../../application/modules/mentor-management/use-cases";
import type {
	MentorApplicationsQuery,
	MentorDiscoveryQuery,
	MentorIdParam,
	RejectMentorBody,
} from "../../../presentation/http/validators/mentor.validator";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { MentorResponseMessages } from "../constants";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class MentorController {
	constructor(
		@inject(TYPES.UseCases.GetMentorRegistrationInfo)
		private readonly _getMentorRegistrationInfoUseCase: IGetMentorRegistrationInfoUseCase,
		@inject(TYPES.UseCases.GetMentorProfile)
		private readonly _getMentorProfileUseCase: IGetMentorProfileUseCase,
		@inject(TYPES.UseCases.GetPublicMentorProfile)
		private readonly _getPublicMentorProfileUseCase: IGetPublicMentorProfileUseCase,
		@inject(TYPES.UseCases.UpdateMentorProfile)
		private readonly _updateMentorProfileUseCase: IUpdateMentorProfileUseCase,
		@inject(TYPES.UseCases.RegisterMentor)
		private readonly _registerMentorUseCase: IRegisterMentorUseCase,
		@inject(TYPES.UseCases.ResubmitMentor)
		private readonly _resubmitMentorUseCase: IResubmitMentorUseCase,
		@inject(TYPES.UseCases.GetMentorApplications)
		private readonly _getMentorApplicationsUseCase: IGetMentorApplicationsUseCase,
		@inject(TYPES.UseCases.GetMentorsDiscovery)
		private readonly _getMentorsDiscoveryUseCase: IGetMentorsUseCase,
		@inject(TYPES.UseCases.ApproveMentor)
		private readonly _approveMentorUseCase: IApproveMentorUseCase,
		@inject(TYPES.UseCases.RejectMentor)
		private readonly _rejectMentorUseCase: IRejectMentorUseCase,
	) {}

	getApplications = asyncHandler(async (req, res) => {
		const query = req.validated?.query as MentorApplicationsQuery;

		const result = await this._getMentorApplicationsUseCase.execute(query);

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.FETCH_APPLICATIONS_SUCCESS,
			data: result,
		});
	});

	getDiscovery = asyncHandler(async (req, res) => {
		const query = req.validated?.query as MentorDiscoveryQuery;
		const userId = (req as AuthenticatedRequest).user.id;

		const result = await this._getMentorsDiscoveryUseCase.execute({
			page: query.page,
			limit: 12,
			excludeUserId: userId,
			search: query.search,
			categoryId: query.categoryId,
			tierName: query.tierName,
			minExperience: query.minExperience,
			maxExperience: query.maxExperience,
			sort: query.sort,
		} as GetMentorsInput);

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.FETCH_DISCOVERY_SUCCESS,
			data: result,
		});
	});

	approveApplication = asyncHandler(async (req, res) => {
		const id = req.params.id as string;
		await this._approveMentorUseCase.execute(id);

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.APPROVE_APPLICATION_SUCCESS,
		});
	});

	rejectApplication = asyncHandler(async (req, res) => {
		const id = req.params.id as string;
		const { reason } = req.validated?.body as RejectMentorBody;
		await this._rejectMentorUseCase.execute({ mentorId: id, reason });

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.REJECT_APPLICATION_SUCCESS,
		});
	});

	getRegistrationInfo = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const result = await this._getMentorRegistrationInfoUseCase.execute({
			userId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.FETCH_REGISTRATION_INFO_SUCCESS,
			data: result,
		});
	});

	getProfile = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._getMentorProfileUseCase.execute({ userId });

		return sendSuccess(res, HttpStatus.OK, {
			message: "Mentor profile fetched successfully",
			data,
		});
	});

	getPublicProfile = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const { id: mentorId } = req.validated?.params as MentorIdParam;
		const data = await this._getPublicMentorProfileUseCase.execute({
			mentorId,
			requesterUserId: userId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: "Public mentor profile fetched successfully",
			data,
		});
	});

	updateProfile = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const data = await this._updateMentorProfileUseCase.execute({
			userId,
			...(req.validated?.body as Omit<
				Parameters<IUpdateMentorProfileUseCase["execute"]>[0],
				"userId"
			>),
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: "Mentor profile updated successfully",
			data,
		});
	});

	register = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		await this._registerMentorUseCase.execute({
			...req.body,
			userId,
		});

		return sendSuccess(res, HttpStatus.CREATED, {
			message: MentorResponseMessages.REGISTRATION_SUBMITTED_SUCCESS,
		});
	});

	resubmit = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		await this._resubmitMentorUseCase.execute({
			...req.body,
			userId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.REGISTRATION_RESUBMITTED_SUCCESS,
		});
	});
}
