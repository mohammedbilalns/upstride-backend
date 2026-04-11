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

const apiContainer = new Container();

registerInfrastructureServiceBindings(apiContainer);
registerRepositoryBindings(apiContainer);
registerQueueBindings(apiContainer);
registerAuthenticationBindings(apiContainer);
registerAdminManagementBindings(apiContainer);
registerArticleBindings(apiContainer);
registerCatalogBindings(apiContainer);
registerChatBindings(apiContainer);
registerMentorBindings(apiContainer);
registerMentorDiscoveryBindings(apiContainer);
registerMentorListsBindings(apiContainer);
registerNotificationBindings(apiContainer);
registerReportBindings(apiContainer);
registerAvailabilityBindings(apiContainer);
registerBookingBindings(apiContainer);
registerPaymentsBindings(apiContainer);

registerPlatformSettingsBindings(apiContainer);
registerProfileBindings(apiContainer);
registerStorageBindings(apiContainer);
registerUserManagementBindings(apiContainer);
registerWalletBindings(apiContainer);
registerPresentationBindings(apiContainer);

export { apiContainer };
