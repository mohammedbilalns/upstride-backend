import {
	fetchExpertiseDto,
	FetchExpertisesResponse,
} from "../../../application/dtos";

export interface IFetchExpertisesUC {
	execute(data: fetchExpertiseDto): Promise<FetchExpertisesResponse>;
}
