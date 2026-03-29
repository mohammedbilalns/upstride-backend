import type { Container } from "inversify";
import {
	AdminManagementController,
	ArticleController,
	AuthController,
	CatalogController,
	ChatController,
	FileController,
	LogoutController,
	MentorController,
	MentorListController,
	NotificationController,
	PasswordResetController,
	PaymentController,
	PlatformSettingsController,
	ProfileController,
	RecurringRuleController,
	ReportController,
	SessionBookingController,
	SessionSlotController,
	UserManagementController,
	WalletController,
} from "../../presentation/http/controllers";
import { WebSocketServer } from "../../presentation/websocket/socket-server";
import { TYPES } from "../../shared/types/types";

export const registerPresentationBindings = (container: Container): void => {
	container
		.bind<WebSocketServer>(TYPES.Services.WebSocketServer)
		.to(WebSocketServer)
		.inSingletonScope();
	container.bind(AuthController).to(AuthController);
	container.bind(PasswordResetController).to(PasswordResetController);
	container.bind(LogoutController).to(LogoutController);
	container.bind(CatalogController).to(CatalogController);
	container.bind(ChatController).to(ChatController);
	container.bind(TYPES.Controllers.Chat).to(ChatController);
	container.bind(UserManagementController).to(UserManagementController);
	container.bind(TYPES.Controllers.UserManagement).to(UserManagementController);
	container.bind(AdminManagementController).to(AdminManagementController);
	container
		.bind(TYPES.Controllers.AdminManagement)
		.to(AdminManagementController);
	container.bind(ArticleController).to(ArticleController);
	container.bind(TYPES.Controllers.Article).to(ArticleController);
	container.bind(FileController).to(FileController);
	container.bind(TYPES.Controllers.File).to(FileController);
	container.bind(MentorController).to(MentorController);
	container.bind(TYPES.Controllers.Mentor).to(MentorController);
	container.bind(MentorListController).to(MentorListController);
	container.bind(TYPES.Controllers.MentorList).to(MentorListController);
	container.bind(NotificationController).to(NotificationController);
	container.bind(TYPES.Controllers.Notification).to(NotificationController);
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
	container.bind(ReportController).to(ReportController);
	container.bind(TYPES.Controllers.Report).to(ReportController);
	container.bind(WalletController).to(WalletController);
	container.bind(TYPES.Controllers.Wallet).to(WalletController);
};
