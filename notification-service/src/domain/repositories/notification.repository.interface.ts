
export interface INotificationRepository<Notification> {
	create(data: Partial<Notification>): Promise<void>
	update(id: string, data: Partial<Notification>): Promise<void>
}
