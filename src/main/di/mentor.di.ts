import type { Container } from "inversify";
import {
	ApproveMentorUseCase,
	GetMentorApplicationsUseCase,
	GetMentorRegistrationInfoUseCase,
	type IApproveMentorUseCase,
	type IGetMentorApplicationsUseCase,
	type IGetMentorRegistrationInfoUseCase,
	type IRegisterMentorUseCase,
	type IRejectMentorUseCase,
	type IResubmitMentorUseCase,
	RegisterMentorUseCase,
	RejectMentorUseCase,
	ResubmitMentorUseCase,
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
		.bind<IApproveMentorUseCase>(TYPES.UseCases.ApproveMentor)
		.to(ApproveMentorUseCase);
	container
		.bind<IRejectMentorUseCase>(TYPES.UseCases.RejectMentor)
		.to(RejectMentorUseCase);
};
