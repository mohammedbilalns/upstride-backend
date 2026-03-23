import type { Container } from "inversify";
import {
	AddMentorToListUseCase,
	CreateMentorListUseCase,
	DeleteMentorListUseCase,
	GetMentorListsUseCase,
	GetMentorListUseCase,
	type IAddMentorToListUseCase,
	type ICreateMentorListUseCase,
	type IDeleteMentorListUseCase,
	type IGetMentorListsUseCase,
	type IGetMentorListUseCase,
	type IRemoveMentorFromListUseCase,
	RemoveMentorFromListUseCase,
} from "../../application/modules/mentor-lists/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerMentorListsBindings = (container: Container): void => {
	container
		.bind<IGetMentorListsUseCase>(TYPES.UseCases.GetMentorLists)
		.to(GetMentorListsUseCase)
		.inSingletonScope();
	container
		.bind<IGetMentorListUseCase>(TYPES.UseCases.GetMentorList)
		.to(GetMentorListUseCase)
		.inSingletonScope();
	container
		.bind<ICreateMentorListUseCase>(TYPES.UseCases.CreateMentorList)
		.to(CreateMentorListUseCase)
		.inSingletonScope();
	container
		.bind<IAddMentorToListUseCase>(TYPES.UseCases.AddMentorToList)
		.to(AddMentorToListUseCase)
		.inSingletonScope();
	container
		.bind<IRemoveMentorFromListUseCase>(TYPES.UseCases.RemoveMentorFromList)
		.to(RemoveMentorFromListUseCase)
		.inSingletonScope();
	container
		.bind<IDeleteMentorListUseCase>(TYPES.UseCases.DeleteMentorList)
		.to(DeleteMentorListUseCase)
		.inSingletonScope();
};
