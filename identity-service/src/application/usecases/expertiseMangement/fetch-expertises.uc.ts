import { UserRole } from "../../../common/enums/user-roles";
import { IExpertiseRepository } from "../../../domain/repositories";
import { IFetchExpertisesUC } from "../../../domain/useCases/expertiseMangement/fetch-expertises.uc.interface";
import { fetchExpertiseDto, FetchExpertisesResponse } from "../../dtos";

export class FetchExpertisesUC implements IFetchExpertisesUC {
	constructor(private _expertiseRepository: IExpertiseRepository) {}

	async execute(dto: fetchExpertiseDto): Promise<FetchExpertisesResponse> {
		const isAdmin =
			dto.userRole === UserRole.ADMIN || dto.userRole === UserRole.SUPER_ADMIN;

		const [expertises, total] = await Promise.all([
			this._expertiseRepository.findAll(
				dto.page,
				dto.limit,
				dto.query,
				!isAdmin,
			),
			this._expertiseRepository.count(dto.query, !isAdmin),
		]);
		const mapped = expertises.map((expertise) => ({
			id: expertise.id,
			name: expertise.name,
			description: expertise.description,
			...(isAdmin && {
				isVerified: expertise.isVerified,
			}),
		}));

		return { data: mapped, total };
	}
}
