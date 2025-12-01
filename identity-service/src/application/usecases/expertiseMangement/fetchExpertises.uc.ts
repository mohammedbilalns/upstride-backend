import { UserRole } from "../../../common/enums/userRoles";
import { IExpertiseRepository } from "../../../domain/repositories";
import { IFetchExpertisesUC } from "../../../domain/useCases/expertiseMangement/fetchExpertises.uc.interface";
import { fetchExpertiseDto, FetchExpertisesResponse } from "../../dtos";

export class FetchExpertisesUC implements IFetchExpertisesUC {
	constructor(private _expertiseRepository: IExpertiseRepository) {}

	async execute(data: fetchExpertiseDto): Promise<FetchExpertisesResponse> {
		const [expertises, total] = await Promise.all([
			this._expertiseRepository.findAll(data.page, data.limit, data.query),
			this._expertiseRepository.count(data.query),
		]);
		const isAdmin = data.userRole === UserRole.ADMIN || UserRole.SUPER_ADMIN;
		const mapped = expertises.map((expertise) => ({
			id: expertise.id,
			name: expertise.name,
			...(isAdmin && {
				description: expertise.description,
				isVerified: expertise.isVerified,
			}),
		}));

		return { data: mapped, total };
	}
}
