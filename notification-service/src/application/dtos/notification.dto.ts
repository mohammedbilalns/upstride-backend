import { Notification } from "../../domain/entities/notification.entity";

export interface NotificationResponseDto {
	notifications: Notification[], 
	total: number
} 
