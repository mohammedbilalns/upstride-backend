import { Notification } from "../../../domain/entities/notification.entity";
import { INotificationRepository } from "../../../domain/repositories/notification.repository.interface";
import { NotificationModel } from "../models/notification.model";

export class NotificationRepository implements INotificationRepository{
	private _model : typeof NotificationModel

	constructor() {
		this._model = NotificationModel;
	}

	async create(data: Partial<Notification>): Promise<void> {
		await this._model.create(data);
	}

	async update(id: string, data: Partial<Notification>):Promise<void> {
		await this._model.findByIdAndUpdate(id, data);
	}

	async findAll(userId: string, page: number, limit: number): Promise<{notifications: Notification[], total: number}> {

		const skip = (page - 1) * limit;
		const [notifications, total] = await Promise.all([
			this._model.find({ userId }).skip(skip).limit(limit).lean(),
			this._model.countDocuments({ userId }),
		]);
		return { notifications, total };

	}

	async findById(id: string): Promise<Notification | null> {
		return this._model.findById(id).lean();
	}

}
