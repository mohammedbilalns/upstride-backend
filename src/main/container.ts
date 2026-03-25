import { Container } from "inversify";
import {
	registerAdminManagementBindings,
	registerArticleBindings,
	registerAuthenticationBindings,
	registerCatalogBindings,
	registerChatBindings,
	registerInfrastructureServiceBindings,
	registerMentorBindings,
	registerMentorDiscoveryBindings,
	registerMentorListsBindings,
	registerNotificationBindings,
	registerPaymentsBindings,
	registerPlatformSettingsBindings,
	registerPresentationBindings,
	registerProfileBindings,
	registerQueueBindings,
	registerRecurringRuleBindings,
	registerReportBindings,
	registerRepositoryBindings,
	registerSessionBookingBindings,
	registerSessionSlotBindings,
	registerStorageBindings,
	registerUserManagementBindings,
	registerWalletBindings,
} from "./di";

const container = new Container();

registerInfrastructureServiceBindings(container);
registerRepositoryBindings(container);
registerQueueBindings(container);
registerAuthenticationBindings(container);
registerAdminManagementBindings(container);
registerArticleBindings(container);
registerCatalogBindings(container);
registerChatBindings(container);
registerMentorBindings(container);
registerMentorDiscoveryBindings(container);
registerMentorListsBindings(container);
registerNotificationBindings(container);
registerRecurringRuleBindings(container);
registerReportBindings(container);
registerSessionBookingBindings(container);
registerSessionSlotBindings(container);
registerPaymentsBindings(container);
registerPlatformSettingsBindings(container);
registerProfileBindings(container);
registerStorageBindings(container);
registerUserManagementBindings(container);
registerWalletBindings(container);
registerPresentationBindings(container);

export { container };
