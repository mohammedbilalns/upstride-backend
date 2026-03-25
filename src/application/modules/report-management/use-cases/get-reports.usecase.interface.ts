import type { GetReportsInput, GetReportsOutput } from "../dtos/report.dto";

export interface IGetReportsUseCase {
	execute(input: GetReportsInput): Promise<GetReportsOutput>;
}
