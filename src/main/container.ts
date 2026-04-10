import { Container } from "inversify";
import {
	registerAdminManagementBindings,
	registerArticleBindings,
	registerAuthenticationBindings,
	registerAvailabilityBindings,
	registerBookingBindings,
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
	registerReportBindings,
	registerRepositoryBindings,
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
registerReportBindings(container);
registerAvailabilityBindings(container);
registerBookingBindings(container);
registerPaymentsBindings(container);

registerPlatformSettingsBindings(container);
registerProfileBindings(container);
registerStorageBindings(container);
registerUserManagementBindings(container);
registerWalletBindings(container);
registerPresentationBindings(container);

export { container };
