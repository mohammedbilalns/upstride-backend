import { Container } from "inversify";
import {
	mailQueue,
	registerAuthenticationBindings,
	registerCatalogBindings,
	registerCommonBindings,
	registerMentorBindings,
	registerPlatformSettingsBindings,
	registerPresentationBindings,
	registerProfileBindings,
	registerStorageBindings,
	registerUserManagementBindings,
} from "./di";

const container = new Container();

registerCommonBindings(container);
registerAuthenticationBindings(container);
registerCatalogBindings(container);
registerMentorBindings(container);
registerPlatformSettingsBindings(container);
registerProfileBindings(container);
registerStorageBindings(container);
registerUserManagementBindings(container);
registerPresentationBindings(container);

export { container, mailQueue };
