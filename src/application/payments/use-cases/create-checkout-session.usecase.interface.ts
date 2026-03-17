import type {
	CreateCheckoutSessionInput,
	CreateCheckoutSessionOutput,
} from "../dtos/create-checkout-session.dto";

export interface ICreateCheckoutSessionUseCase {
	execute(
		input: CreateCheckoutSessionInput,
	): Promise<CreateCheckoutSessionOutput>;
}
