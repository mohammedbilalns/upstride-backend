import { Container } from "inversify";
import {
	mailQueue,
	registerAuthenticationBindings,
	registerCatalogBindings,
	registerCommonBindings,
	registerMentorBindings,
	registerPaymentsBindings,
	registerPlatformSettingsBindings,
	registerPresentationBindings,
	registerProfileBindings,
	registerStorageBindings,
	registerUserManagementBindings,
	registerWalletBindings,
} from "./di";

const container = new Container();

registerCommonBindings(container);
registerAuthenticationBindings(container);
registerCatalogBindings(container);
registerMentorBindings(container);
registerPaymentsBindings(container);
registerPlatformSettingsBindings(container);
registerProfileBindings(container);
registerStorageBindings(container);
registerUserManagementBindings(container);
registerWalletBindings(container);
registerPresentationBindings(container);

export { container, mailQueue };
