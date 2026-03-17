import { EntityValidationError } from "../errors";
export enum PaymentStatus {
	Pending = "pending",
	Completed = "completed",
	Failed = "failed",
	Refunded = "refunded",
}
export enum PaymentProvider {
	Stripe = "stripe",
}

export class PaymentTransaction {
	public readonly id: string;
	public readonly userId: string;
	public readonly provider: PaymentProvider;
	public readonly providerPaymentId: string;
	public readonly amount: number;
	public readonly currency: string;
	public readonly status: PaymentStatus;
	public readonly coinsGranted: number;
	public readonly createdAt: Date;

	constructor(
		id: string,
		userId: string,
		provider: PaymentProvider,
		providerPaymentId: string,
		amount: number,
		currency: string,
		status: PaymentStatus,
		coinsGranted: number,
		createdAt?: Date,
	) {
		if (!providerPaymentId)
			throw new EntityValidationError(
				"PaymentTransaction",
				"missing provider id",
			);

		this.id = id;
		this.userId = userId;
		this.provider = provider;
		this.providerPaymentId = providerPaymentId;
		this.amount = amount;
		this.currency = currency;
		this.status = status;
		this.coinsGranted = coinsGranted;
		this.createdAt = createdAt ?? new Date();

		Object.freeze(this);
	}
}
