import type {
	JoinSessionInput,
	JoinSessionOutput,
} from "../dtos/join-session.dto";

export interface IJoinSessionUseCase {
	execute(input: JoinSessionInput): Promise<JoinSessionOutput>;
}
