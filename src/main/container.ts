import { Container } from "inversify";
import {
	registerAdminManagementBindings,
	registerAuthenticationBindings,
	registerCatalogBindings,
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
registerCatalogBindings(container);
registerMentorBindings(container);
registerMentorDiscoveryBindings(container);
registerMentorListsBindings(container);
registerNotificationBindings(container);
registerRecurringRuleBindings(container);
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
