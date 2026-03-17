import type { Container } from "inversify";
import {
	CancelSlotUseCase,
	CreateCustomSlotUseCase,
	DeleteSlotUseCase,
	EnableSlotUseCase,
	GenerateSlotsUseCase,
	GetMentorSlotsUseCase,
	type ICancelSlotUseCase,
	type ICreateCustomSlotUseCase,
	type IDeleteSlotUseCase,
	type IEnableSlotUseCase,
	type IGenerateSlotsUseCase,
	type IGetMentorSlotsUseCase,
} from "../../application/session-slot-management/use-cases";
import { TYPES } from "../../shared/types/types";

export const registerSessionSlotBindings = (container: Container): void => {
	container
		.bind<ICancelSlotUseCase>(TYPES.UseCases.CancelSlot)
		.to(CancelSlotUseCase);
	container
		.bind<ICreateCustomSlotUseCase>(TYPES.UseCases.CreateCustomSlot)
		.to(CreateCustomSlotUseCase);
	container
		.bind<IDeleteSlotUseCase>(TYPES.UseCases.DeleteSlot)
		.to(DeleteSlotUseCase);
	container
		.bind<IEnableSlotUseCase>(TYPES.UseCases.EnableSlot)
		.to(EnableSlotUseCase);
	container
		.bind<IGenerateSlotsUseCase>(TYPES.UseCases.GenerateSlots)
		.to(GenerateSlotsUseCase);
	container
		.bind<IGetMentorSlotsUseCase>(TYPES.UseCases.GetMentorSlots)
		.to(GetMentorSlotsUseCase);
};
