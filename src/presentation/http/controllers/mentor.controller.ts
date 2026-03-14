import { inject, injectable } from "inversify";
import type {
	IApproveMentorUseCase,
	IGetMentorApplicationsUseCase,
	IGetMentorRegistrationInfoUseCase,
	IRegisterMentorUseCase,
	IRejectMentorUseCase,
	IResubmitMentorUseCase,
} from "../../../application/mentor-management/use-cases";
import type {
	MentorApplicationsQuery,
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
		private readonly getMentorRegistrationInfoUseCase: IGetMentorRegistrationInfoUseCase,
		@inject(TYPES.UseCases.RegisterMentor)
		private readonly registerMentorUseCase: IRegisterMentorUseCase,
		@inject(TYPES.UseCases.ResubmitMentor)
		private readonly resubmitMentorUseCase: IResubmitMentorUseCase,
		@inject(TYPES.UseCases.GetMentorApplications)
		private readonly getMentorApplicationsUseCase: IGetMentorApplicationsUseCase,
		@inject(TYPES.UseCases.ApproveMentor)
		private readonly approveMentorUseCase: IApproveMentorUseCase,
		@inject(TYPES.UseCases.RejectMentor)
		private readonly rejectMentorUseCase: IRejectMentorUseCase,
	) {}

	getApplications = asyncHandler(async (req, res) => {
		const query = req.query as unknown as MentorApplicationsQuery;

		const result = await this.getMentorApplicationsUseCase.execute(query);

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.FETCH_APPLICATIONS_SUCCESS,
			data: result,
		});
	});

	approveApplication = asyncHandler(async (req, res) => {
		const id = req.params.id as string;
		await this.approveMentorUseCase.execute(id);

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.APPROVE_APPLICATION_SUCCESS,
		});
	});

	rejectApplication = asyncHandler(async (req, res) => {
		const id = req.params.id as string;
		const { reason } = req.validated?.body as RejectMentorBody;
		await this.rejectMentorUseCase.execute({ mentorId: id, reason });

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.REJECT_APPLICATION_SUCCESS,
		});
	});

	getRegistrationInfo = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		const result = await this.getMentorRegistrationInfoUseCase.execute({
			userId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.FETCH_REGISTRATION_INFO_SUCCESS,
			data: result,
		});
	});

	register = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		await this.registerMentorUseCase.execute({
			...req.body,
			userId,
		});

		return sendSuccess(res, HttpStatus.CREATED, {
			message: MentorResponseMessages.REGISTRATION_SUBMITTED_SUCCESS,
		});
	});

	resubmit = asyncHandler(async (req, res) => {
		const userId = (req as AuthenticatedRequest).user.id;
		await this.resubmitMentorUseCase.execute({
			...req.body,
			userId,
		});

		return sendSuccess(res, HttpStatus.OK, {
			message: MentorResponseMessages.REGISTRATION_RESUBMITTED_SUCCESS,
		});
	});
}
