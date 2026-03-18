import type { Container } from "inversify";
import {
	AdminManagementController,
	AuthController,
	CatalogController,
	FileController,
	LogoutController,
	MentorController,
	MentorListController,
	PasswordResetController,
	PaymentController,
	PlatformSettingsController,
	ProfileController,
	RecurringRuleController,
	SessionBookingController,
	SessionSlotController,
	UserManagementController,
	WalletController,
} from "../../presentation/http/controllers";
import { TYPES } from "../../shared/types/types";

export const registerPresentationBindings = (container: Container): void => {
	container.bind(AuthController).to(AuthController);
	container.bind(PasswordResetController).to(PasswordResetController);
	container.bind(LogoutController).to(LogoutController);
	container.bind(CatalogController).to(CatalogController);
	container.bind(UserManagementController).to(UserManagementController);
	container.bind(TYPES.Controllers.UserManagement).to(UserManagementController);
	container.bind(AdminManagementController).to(AdminManagementController);
	container
		.bind(TYPES.Controllers.AdminManagement)
		.to(AdminManagementController);
	container.bind(FileController).to(FileController);
	container.bind(TYPES.Controllers.File).to(FileController);
	container.bind(MentorController).to(MentorController);
	container.bind(TYPES.Controllers.Mentor).to(MentorController);
	container.bind(MentorListController).to(MentorListController);
	container.bind(TYPES.Controllers.MentorList).to(MentorListController);
	container.bind(RecurringRuleController).to(RecurringRuleController);
	container.bind(TYPES.Controllers.RecurringRule).to(RecurringRuleController);
	container.bind(SessionBookingController).to(SessionBookingController);
	container.bind(TYPES.Controllers.SessionBooking).to(SessionBookingController);
	container.bind(SessionSlotController).to(SessionSlotController);
	container.bind(TYPES.Controllers.SessionSlot).to(SessionSlotController);
	container.bind(PaymentController).to(PaymentController);
	container.bind(TYPES.Controllers.Payment).to(PaymentController);
	container.bind(PlatformSettingsController).to(PlatformSettingsController);
	container
		.bind(TYPES.Controllers.PlatformSettings)
		.to(PlatformSettingsController);
	container.bind(ProfileController).to(ProfileController);
	container
		.bind<ProfileController>(TYPES.Controllers.Profile)
		.to(ProfileController);
	container.bind(WalletController).to(WalletController);
	container.bind(TYPES.Controllers.Wallet).to(WalletController);
};
