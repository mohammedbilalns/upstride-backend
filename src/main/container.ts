import { Container } from "inversify";
import {
	mailQueue,
	registerAdminManagementBindings,
	registerAuthenticationBindings,
	registerCatalogBindings,
	registerCommonBindings,
	registerMentorBindings,
	registerMentorDiscoveryBindings,
	registerMentorListsBindings,
	registerPaymentsBindings,
	registerPlatformSettingsBindings,
	registerPresentationBindings,
	registerProfileBindings,
	registerRecurringRuleBindings,
	registerStorageBindings,
	registerUserManagementBindings,
	registerWalletBindings,
} from "./di";

const container = new Container();

registerCommonBindings(container);
registerAuthenticationBindings(container);
registerAdminManagementBindings(container);
registerCatalogBindings(container);
registerMentorBindings(container);
registerMentorDiscoveryBindings(container);
registerMentorListsBindings(container);
registerRecurringRuleBindings(container);
registerPaymentsBindings(container);
registerPlatformSettingsBindings(container);
registerProfileBindings(container);
registerStorageBindings(container);
registerUserManagementBindings(container);
registerWalletBindings(container);
registerPresentationBindings(container);

export { container, mailQueue };
