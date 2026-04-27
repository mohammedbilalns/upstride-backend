import type {
	RefundSessionAmountInput,
	RefundSessionAmountResponse,
} from "../dtos/booking.dto";

export interface IRefundSessionAmountUseCase {
	execute(
		input: RefundSessionAmountInput,
	): Promise<RefundSessionAmountResponse>;
}
