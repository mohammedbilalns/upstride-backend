import type { DisableProfessionInput } from "../dtos/disable-profession.dto";

export interface DisableProfessionOutput {
	resourceId: string;
}

export interface IDisableProfessionUseCase {
	execute(input: DisableProfessionInput): Promise<DisableProfessionOutput>;
}
