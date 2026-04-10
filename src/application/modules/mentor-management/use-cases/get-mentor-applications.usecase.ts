import { inject, injectable } from "inversify";
import type {
	IMentorListReadRepository,
	MentorQuery,
} from "../../../../domain/repositories";
import { TYPES } from "../../../../shared/types/types";
import type { IStorageService } from "../../../services/storage.service.interface";
import { mapPaginatedResult } from "../../../shared/utilities/pagination.util";
import type {
	GetMentorApplicationsInput,
	GetMentorApplicationsResponse,
} from "../dtos/get-mentor-applications.dto";
import { MentorApplicationMapper } from "../mappers/mentor-application.mapper";
import type { IGetMentorApplicationsUseCase } from "./get-mentor-applications.usecase.interface";

@injectable()
export class GetMentorApplicationsUseCase
	implements IGetMentorApplicationsUseCase
{
	constructor(
		@inject(TYPES.Repositories.MentorListReadRepository)
		private _mentorRepository: IMentorListReadRepository,
		@inject(TYPES.Services.Storage)
		private _storageService: IStorageService,
	) {}

	async execute(
		input: GetMentorApplicationsInput,
	): Promise<GetMentorApplicationsResponse> {
		const query: MentorQuery = {};

		if (input.status === "approved") {
			query.isApproved = true;
			query.isRejected = false;
		} else if (input.status === "rejected") {
			query.isApproved = false;
			query.isRejected = true;
		} else if (input.status === "pending") {
			query.isApproved = false;
			query.isRejected = false;
		}

		let sort: Record<string, 1 | -1> = { createdAt: -1 };
		if (input.sort === "old") {
			sort = { createdAt: 1 };
		} else if (input.sort === "status") {
			sort = { isApproved: -1, isRejected: -1, createdAt: -1 };
		}

		const result = await this._mentorRepository.paginate({
			page: input.page,
			limit: input.limit,
			query,
			sort,
		});

		const items = await Promise.all(
			result.items.map(async (item) => {
				const resumeUrl = await this._storageService.getSignedUrl(
					item.resumeId,
				);
				return MentorApplicationMapper.toDTO(item, resumeUrl);
			}),
		);

		return mapPaginatedResult(result, () => items);
	}
}
