import { injectable } from "inversify";
import type { QueryFilter } from "mongoose";
import type { PaymentTransaction } from "../../../../domain/entities/payment-transactions.entity";
import type { PaginateParams } from "../../../../domain/repositories";
import type { QueryParams } from "../../../../domain/repositories/capabilities";
import type { PaginatedResult } from "../../../../domain/repositories/capabilities/paginatable.repository.interface";
import type {
	IPaymentTransactionRepository,
	PaymentTransactionQuery,
} from "../../../../domain/repositories/payment-transactions.repository.interface";
import { PaymentTransactionMapper } from "../mappers/payment-transactions.mapper";
import {
	type PaymentTransactionDocument,
	PaymentTransactionModel,
} from "../models/payment-transactions.model";
import { AbstractMongoRepository } from "./abstract.repository";

@injectable()
export class MongoPaymentTransactionRepository
	extends AbstractMongoRepository<
		PaymentTransaction,
		PaymentTransactionDocument
	>
	implements IPaymentTransactionRepository
{
	constructor() {
		super(PaymentTransactionModel);
	}

	protected toDomain(doc: PaymentTransactionDocument): PaymentTransaction {
		return PaymentTransactionMapper.toDomain(doc);
	}

	protected toDocument(
		entity: PaymentTransaction,
	): Partial<PaymentTransactionDocument> {
		return PaymentTransactionMapper.toDocument(entity);
	}

	async create(transaction: PaymentTransaction): Promise<PaymentTransaction> {
		return this.createDocument(transaction);
	}

	async findById(id: string): Promise<PaymentTransaction | null> {
		return this.findByIdDocument(id);
	}

	async findByProviderPaymentId(
		providerPaymentId: string,
	): Promise<PaymentTransaction | null> {
		const doc = await this.model.findOne({ providerPaymentId }).lean();
		return doc ? this.toDomain(doc as PaymentTransactionDocument) : null;
	}

	async findAllByUserId(userId: string): Promise<PaymentTransaction[]> {
		const docs = await this.model
			.find({ userId })
			.sort({ createdAt: -1 })
			.lean();

		return docs.map((doc) => this.toDomain(doc as PaymentTransactionDocument));
	}

	async query({
		query,
		sort,
	}: QueryParams<PaymentTransactionQuery>): Promise<PaymentTransaction[]> {
		const filter: QueryFilter<PaymentTransactionDocument> = {};

		if (query?.userId) {
			filter.userId = query.userId;
		}

		if (query?.provider) {
			filter.provider = query.provider;
		}

		if (query?.status) {
			filter.status = Array.isArray(query.status)
				? { $in: query.status }
				: query.status;
		}

		if (query?.providerPaymentId) {
			filter.providerPaymentId = query.providerPaymentId;
		}

		const docs = await this.model
			.find(filter)
			.sort(sort ?? { createdAt: -1 })
			.lean();

		return docs.map((doc) => this.toDomain(doc as PaymentTransactionDocument));
	}

	async paginate({
		page,
		limit,
		query,
		sort,
	}: PaginateParams<PaymentTransactionQuery>): Promise<
		PaginatedResult<PaymentTransaction>
	> {
		const filter: QueryFilter<PaymentTransactionDocument> = {};

		if (query?.userId) {
			filter.userId = query.userId;
		}

		if (query?.provider) {
			filter.provider = query.provider;
		}

		if (query?.status) {
			filter.status = Array.isArray(query.status)
				? { $in: query.status }
				: query.status;
		}

		if (query?.providerPaymentId) {
			filter.providerPaymentId = query.providerPaymentId;
		}

		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this.model
				.find(filter)
				.sort(sort ?? { createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			this.model.countDocuments(filter),
		]);

		const items = docs.map((doc) =>
			this.toDomain(doc as PaymentTransactionDocument),
		);

		return this.buildPaginatedResult(items, total, page, limit);
	}
}
