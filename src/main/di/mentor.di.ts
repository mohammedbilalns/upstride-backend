import type { Container } from "inversify";
import {
	ApproveMentorUseCase,
	GetMentorApplicationsUseCase,
	GetMentorProfileUseCase,
	GetMentorRegistrationInfoUseCase,
	GetPublicMentorProfileUseCase,
	type IApproveMentorUseCase,
	type IGetMentorApplicationsUseCase,
	type IGetMentorProfileUseCase,
	type IGetMentorRegistrationInfoUseCase,
	type IGetPublicMentorProfileUseCase,
	type IRegisterMentorUseCase,
	type IRejectMentorUseCase,
	type IResubmitMentorUseCase,
	type IUpdateMentorProfileUseCase,
	RegisterMentorUseCase,
	RejectMentorUseCase,
	ResubmitMentorUseCase,
	UpdateMentorProfileUseCase,
} from "../../application/modules/mentor-moderation/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerMentorBindings = (container: Container): void => {
	container
		.bind<IGetMentorRegistrationInfoUseCase>(
			TYPES.UseCases.GetMentorRegistrationInfo,
		)
		.to(GetMentorRegistrationInfoUseCase)
		.inSingletonScope();
	container
		.bind<IRegisterMentorUseCase>(TYPES.UseCases.RegisterMentor)
		.to(RegisterMentorUseCase)
		.inSingletonScope();
	container
		.bind<IResubmitMentorUseCase>(TYPES.UseCases.ResubmitMentor)
		.to(ResubmitMentorUseCase)
		.inSingletonScope();
	container
		.bind<IGetMentorApplicationsUseCase>(TYPES.UseCases.GetMentorApplications)
		.to(GetMentorApplicationsUseCase)
		.inSingletonScope();
	container
		.bind<IGetMentorProfileUseCase>(TYPES.UseCases.GetMentorProfile)
		.to(GetMentorProfileUseCase)
		.inSingletonScope();
	container
		.bind<IGetPublicMentorProfileUseCase>(TYPES.UseCases.GetPublicMentorProfile)
		.to(GetPublicMentorProfileUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateMentorProfileUseCase>(TYPES.UseCases.UpdateMentorProfile)
		.to(UpdateMentorProfileUseCase)
		.inSingletonScope();
	container
		.bind<IApproveMentorUseCase>(TYPES.UseCases.ApproveMentor)
		.to(ApproveMentorUseCase)
		.inSingletonScope();
	container
		.bind<IRejectMentorUseCase>(TYPES.UseCases.RejectMentor)
		.to(RejectMentorUseCase)
		.inSingletonScope();
};
