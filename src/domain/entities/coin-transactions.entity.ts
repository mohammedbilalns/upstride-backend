import { EntityValidationError } from "../errors";

export enum CoinTransactionType {
	Purchase = "purchase",
	SessionSpend = "session_spend",
	SessionEarning = "session_earning",
	AppreciationSpend = "appreciation_spend",
	AppreciationEarning = "appreciation_earning",
	ArticleReward = "article_reward",
	SignupBonus = "signup_bonus",
	Refund = "refund",
}

export class CoinTransaction {
	public readonly id: string;
	public readonly userId: string;
	public readonly amount: number;
	public readonly type: CoinTransactionType;
	public readonly referenceType?: string;
	public readonly referenceId?: string;
	public readonly createdAt: Date;

	constructor(
		id: string,
		userId: string,
		amount: number,
		type: CoinTransactionType,
		referenceType?: string,
		referenceId?: string,
		createdAt?: Date,
	) {
		if (!userId || amount === 0)
			throw new EntityValidationError("CoinTransaction", "invalid transaction");

		this.id = id;
		this.userId = userId;
		this.amount = amount;
		this.type = type;
		this.referenceType = referenceType;
		this.referenceId = referenceId;
		this.createdAt = createdAt ?? new Date();

		Object.freeze(this);
	}
}
