import { Payment } from "../../../domain/entities/payment.entity";
import { IPaymentRepository } from "../../../domain/repositories/payment.repository.interface";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { IPaymentDocument, PaymentModel } from "../models/payment.model";
import { BaseRepository } from "./base.repository";

export class PaymentRepository
	extends BaseRepository<Payment, IPaymentDocument>
	implements IPaymentRepository
{
	constructor() {
		super(PaymentModel);
	}

	async create(payment: Omit<Payment, "id">): Promise<Payment> {
		return super.create(payment as any);
	}

	protected mapToDomain(doc: IPaymentDocument): Payment {
		const mapped = mapMongoDocument(doc)!;
		return {
			id: mapped.id,
			userId: mapped.userId,
			mentorId: mapped.mentorId,
			bookingId: mapped.bookingId,
			sessionId: mapped.sessionId,
			amount: mapped.amount,
			currency: mapped.currency,
			status: mapped.status,
			transactionId: mapped.transactionId,
			paymentMethod: mapped.paymentMethod,
			createdAt: mapped.createdAt,
			updatedAt: mapped.updatedAt,
		};
	}

	public async updateStatus(
		id: string,
		status: Payment["status"],
	): Promise<Payment | null> {
		return this.update(id, { status } as any);
	}

	async findByTransactionId(transactionId: string): Promise<Payment | null> {
		const doc = await this._model.findOne({ transactionId }).exec();
		return doc ? this.mapToDomain(doc) : null;
	}

	async findByUserId(userId: string): Promise<Payment[]> {
		const docs = await this._model.find({ userId }).exec();
		return docs.map((doc) => this.mapToDomain(doc));
	}

	async findByMentorId(mentorId: string): Promise<Payment[]> {
		const docs = await this._model.find({ mentorId }).exec();
		return docs.map((doc) => this.mapToDomain(doc));
	}
}
