import type { DeleteResult, FilterQuery} from "mongoose";
import type { Notification } from "../../../domain/entities/notification.entity";
import type { INotificationRepository } from "../../../domain/repositories/notification.repository.interface";
import { INotification, NotificationModel } from "../models/notification.model";
import { mapMongoDocument } from "../mappers/mongoose.mapper";
import { AppError } from "../../../application/errors/AppError";
import { ErrorMessage } from "../../../common/enums";

export class NotificationRepository implements INotificationRepository {
	private _model: typeof NotificationModel;

	private mapToDomain(doc: INotification): Notification {
		const mapped = mapMongoDocument(doc)
		if(!mapped) throw new AppError(ErrorMessage.FAILED_TO_MAP_DATA)
		return {
			id: mapped.id,
			userId: doc.userId,
			type: doc.type,
			title: doc.title,
			content: doc.content,
			link: doc.link,
			isRead: doc.isRead,
			createdAt: doc.createdAt,
		};
	}

	constructor() {
		this._model = NotificationModel;
	}

	async create(data: Partial<Notification>): Promise<Notification | null> {
		const doc = await this._model.create(data);
		return this.mapToDomain(doc);
	}

	async update(id: string, data: Partial<Notification>): Promise<void> {
		await this._model.findByIdAndUpdate(id, data);
	}

	async findAll(
		userId: string,
		page: number,
		limit: number,
	): Promise<{ notifications: Notification[]; total: number, unreadCount: number }> {
		const skip = (page - 1) * limit;
		const [notifications, total, unreadCount] = await Promise.all([
			this._model.find({ userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
			this._model.countDocuments({ userId }).lean(),
			this._model.countDocuments({userId, isRead: false}).lean(),
		]);
		const mappedNotifications = notifications.map(this.mapToDomain);
		return { notifications:mappedNotifications, total, unreadCount };
	}

	async findById(id: string): Promise<Notification | null> {
		const doc = await this._model.findById(id);	
		if(!doc) return null;
		return this.mapToDomain(doc);
	}

	async deleteMany(filter: FilterQuery<Notification>): Promise<DeleteResult> {
		return await this._model.deleteMany(filter).lean();
	}
	async updateMany(filter: FilterQuery<Notification>, data: Partial<Notification>): Promise<void> {
		await this._model.updateMany(filter, data);
	}
}
