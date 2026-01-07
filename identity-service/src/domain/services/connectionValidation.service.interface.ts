import { ValidateConnectionDto } from "../../application/dtos/connection.dto";

export interface IConnectionValidationService {
	validate(dto: ValidateConnectionDto): Promise<false | string>;
}
