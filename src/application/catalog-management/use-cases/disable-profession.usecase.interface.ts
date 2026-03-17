import type { DisableProfessionInput } from "../dtos/disable-profession.dto";

export interface IDisableProfessionUseCase {
	execute(input: DisableProfessionInput): Promise<void>;
}
