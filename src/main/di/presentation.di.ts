import type { Container } from "inversify";
import {
	AuthController,
	CatalogController,
	FileController,
	LogoutController,
	MentorController,
	PasswordResetController,
	ProfileController,
	UserManagementController,
} from "../../presentation/http/controllers";
import { TYPES } from "../../shared/types/types";

export const registerPresentationBindings = (container: Container): void => {
	container.bind(AuthController).to(AuthController);
	container.bind(PasswordResetController).to(PasswordResetController);
	container.bind(LogoutController).to(LogoutController);
	container.bind(CatalogController).to(CatalogController);
	container.bind(UserManagementController).to(UserManagementController);
	container.bind(TYPES.Controllers.UserManagement).to(UserManagementController);
	container.bind(FileController).to(FileController);
	container.bind(TYPES.Controllers.File).to(FileController);
	container.bind(MentorController).to(MentorController);
	container.bind(TYPES.Controllers.Mentor).to(MentorController);
	container.bind(ProfileController).to(ProfileController);
	container
		.bind<ProfileController>(TYPES.Controllers.Profile)
		.to(ProfileController);
};
