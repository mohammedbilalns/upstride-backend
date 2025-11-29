import { getMentorRule } from "../../../application/dtos/slot.dto";
import { Availability } from "../../entities/availability.entity";

export interface IGetRulesUC {
	execute(dto: getMentorRule): Promise<Availability>;
}
