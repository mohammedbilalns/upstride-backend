import type { Response } from "express";
import { inject, injectable } from "inversify";
import type {
	AddMentorToListInput,
	CreateMentorListInput,
	DeleteMentorListInput,
	GetMentorListInput,
	GetMentorListsInput,
	RemoveMentorFromListInput,
} from "../../../application/mentor-lists/dtos/mentor-list.dto";
import type {
	IAddMentorToListUseCase,
	ICreateMentorListUseCase,
	IDeleteMentorListUseCase,
	IGetMentorListsUseCase,
	IGetMentorListUseCase,
	IRemoveMentorFromListUseCase,
} from "../../../application/mentor-lists/use-cases";
import { HttpStatus } from "../../../shared/constants";
import type { AuthenticatedRequest } from "../../../shared/types/authenticated-request.type";
import { TYPES } from "../../../shared/types/types";
import { asyncHandler, sendSuccess } from "../helpers";

@injectable()
export class MentorListController {
	constructor(
		@inject(TYPES.UseCases.GetMentorLists)
		private readonly _getMentorListsUseCase: IGetMentorListsUseCase,
		@inject(TYPES.UseCases.GetMentorList)
		private readonly _getMentorListUseCase: IGetMentorListUseCase,
		@inject(TYPES.UseCases.CreateMentorList)
		private readonly _createMentorListUseCase: ICreateMentorListUseCase,
		@inject(TYPES.UseCases.AddMentorToList)
		private readonly _addMentorToListUseCase: IAddMentorToListUseCase,
		@inject(TYPES.UseCases.RemoveMentorFromList)
		private readonly _removeMentorFromListUseCase: IRemoveMentorFromListUseCase,
		@inject(TYPES.UseCases.DeleteMentorList)
		private readonly _deleteMentorListUseCase: IDeleteMentorListUseCase,
	) {}

	getLists = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const data = await this._getMentorListsUseCase.execute({
			userId: req.user.id,
		} as GetMentorListsInput);

		sendSuccess(res, HttpStatus.OK, { data });
	});

	getList = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const { listId } = req.validated?.params as { listId: string };
		const data = await this._getMentorListUseCase.execute({
			userId: req.user.id,
			listId,
		} as GetMentorListInput);

		sendSuccess(res, HttpStatus.OK, { data });
	});

	createList = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const body = req.validated?.body as CreateMentorListInput;
			const data = await this._createMentorListUseCase.execute({
				userId: req.user.id,
				name: body.name,
				description: body.description,
			});

			sendSuccess(res, HttpStatus.CREATED, { data });
		},
	);

	addMentor = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
		const { listId } = req.validated?.params as { listId: string };
		const body = req.validated?.body as { mentorId: string };
		await this._addMentorToListUseCase.execute({
			userId: req.user.id,
			listId,
			mentorId: body.mentorId,
		} as AddMentorToListInput);

		sendSuccess(res, HttpStatus.OK);
	});

	removeMentor = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { listId, mentorId } = req.validated?.params as {
				listId: string;
				mentorId: string;
			};
			await this._removeMentorFromListUseCase.execute({
				userId: req.user.id,
				listId,
				mentorId,
			} as RemoveMentorFromListInput);

			sendSuccess(res, HttpStatus.OK);
		},
	);

	deleteList = asyncHandler(
		async (req: AuthenticatedRequest, res: Response) => {
			const { listId } = req.validated?.params as { listId: string };
			await this._deleteMentorListUseCase.execute({
				userId: req.user.id,
				listId,
			} as DeleteMentorListInput);

			sendSuccess(res, HttpStatus.OK);
		},
	);
}
