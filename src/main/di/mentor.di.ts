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
} from "../../application/mentor-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerMentorBindings = (container: Container): void => {
	container
		.bind<IGetMentorRegistrationInfoUseCase>(
			TYPES.UseCases.GetMentorRegistrationInfo,
		)
		.to(GetMentorRegistrationInfoUseCase);
	container
		.bind<IRegisterMentorUseCase>(TYPES.UseCases.RegisterMentor)
		.to(RegisterMentorUseCase);
	container
		.bind<IResubmitMentorUseCase>(TYPES.UseCases.ResubmitMentor)
		.to(ResubmitMentorUseCase);
	container
		.bind<IGetMentorApplicationsUseCase>(TYPES.UseCases.GetMentorApplications)
		.to(GetMentorApplicationsUseCase);
	container
		.bind<IGetMentorProfileUseCase>(TYPES.UseCases.GetMentorProfile)
		.to(GetMentorProfileUseCase);
	container
		.bind<IGetPublicMentorProfileUseCase>(TYPES.UseCases.GetPublicMentorProfile)
		.to(GetPublicMentorProfileUseCase);
	container
		.bind<IUpdateMentorProfileUseCase>(TYPES.UseCases.UpdateMentorProfile)
		.to(UpdateMentorProfileUseCase);
	container
		.bind<IApproveMentorUseCase>(TYPES.UseCases.ApproveMentor)
		.to(ApproveMentorUseCase);
	container
		.bind<IRejectMentorUseCase>(TYPES.UseCases.RejectMentor)
		.to(RejectMentorUseCase);
};
