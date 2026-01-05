import {
	DEFAULT_NOTIFICATION_VALUES,
	NOTIFICATION_TEMPLATES,
} from "../../common/constants";
import { INotificationGenerator } from "../../domain/services/notification-generator.service.interface";
import {
	GenerateNotificationDto,
	NotificationData,
} from "../dtos/notification-generator.dto";

export class NotificationGeneratorService implements INotificationGenerator {
	constructor() {}

	generate(trigger: GenerateNotificationDto): NotificationData {
		const template = NOTIFICATION_TEMPLATES[trigger.type];

		if (!template) {
			return {
				title: DEFAULT_NOTIFICATION_VALUES.title,
				content: DEFAULT_NOTIFICATION_VALUES.content,
				type: DEFAULT_NOTIFICATION_VALUES.type,
			};
		}

		const title = template.getTitle(trigger);
		const content = template.getContent(trigger);
		const link = template.getLink ? template.getLink(trigger) : undefined;

		return { title, content, link, type: template.type };
	}
}
