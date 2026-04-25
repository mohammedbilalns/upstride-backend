import { Container } from "inversify";
import {
	registerAdminBindings,
	registerArticleBindings,
	registerAuthenticationBindings,
	registerAvailabilityBindings,
	registerBookingBindings,
	registerCatalogBindings,
	registerChatBindings,
	registerDashboardBindings,
	registerEventHandlersBindings,
	registerInfrastructureServiceBindings,
	registerLiveCallBindings,
	registerMentorBindings,
	registerMentorDiscoveryBindings,
	registerMentorListsBindings,
	registerNotificationBindings,
	registerPaymentsBindings,
	registerPresentationBindings,
	registerProfileBindings,
	registerQueueBindings,
	registerReportBindings,
	registerRepositoryBindings,
	registerReviewBindings,
	registerStorageBindings,
	registerUsersBindings,
	registerWalletBindings,
} from ".";

const apiContainer = new Container();

registerInfrastructureServiceBindings(apiContainer);
registerRepositoryBindings(apiContainer);
registerQueueBindings(apiContainer);
registerAuthenticationBindings(apiContainer);
registerAdminBindings(apiContainer);
registerArticleBindings(apiContainer);
registerCatalogBindings(apiContainer);
registerChatBindings(apiContainer);
registerLiveCallBindings(apiContainer);
registerMentorBindings(apiContainer);
registerMentorDiscoveryBindings(apiContainer);
registerMentorListsBindings(apiContainer);
registerNotificationBindings(apiContainer);
registerReportBindings(apiContainer);
registerAvailabilityBindings(apiContainer);
registerBookingBindings(apiContainer);
registerDashboardBindings(apiContainer);
registerPaymentsBindings(apiContainer);
registerReviewBindings(apiContainer);
registerEventHandlersBindings(apiContainer);
registerProfileBindings(apiContainer);
registerStorageBindings(apiContainer);
registerUsersBindings(apiContainer);
registerWalletBindings(apiContainer);
registerPresentationBindings(apiContainer);

export { apiContainer };
