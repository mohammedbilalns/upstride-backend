import type {
	BookSessionInput,
	BookSessionResponse,
} from "../dtos/session-booking.dto";

export interface IBookSessionUseCase {
	execute(input: BookSessionInput): Promise<BookSessionResponse>;
}
