import type { Container } from "inversify";
import { CheckAndCreateAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/check-and-create-availability.usecase";
import type { ICheckAndCreateAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/check-and-create-availability.usecase.interface";
import { CheckAndReenableAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/check-and-reenable-availability.usecase";
import type { ICheckAndReenableAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/check-and-reenable-availability.usecase.interface";
import { CreateAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/create-availability.usecase";
import type { ICreateAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/create-availability.usecase.interface";
import { DeleteAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/delete-availability.usecase";
import type { IDeleteAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/delete-availability.usecase.interface";
import { GetMentorAvailabilitiesUseCase } from "../../application/modules/availability-management/use-cases/get-mentor-availabilities.usecase";
import type { IGetMentorAvailabilitiesUseCase } from "../../application/modules/availability-management/use-cases/get-mentor-availabilities.usecase.interface";
import { ReenableAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/reenable-availability.usecase";
import type { IReenableAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/reenable-availability.usecase.interface";
import { UpdateAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/update-availability.usecase";
import type { IUpdateAvailabilityUseCase } from "../../application/modules/availability-management/use-cases/update-availability.usecase.interface";
import { AvailabilityController } from "../../presentation/http/controllers/availability.controller";
import { TYPES } from "../../shared/types/types";

export const registerAvailabilityBindings = (container: Container): void => {
	// Use Cases
	container
		.bind<ICreateAvailabilityUseCase>(TYPES.UseCases.CreateAvailability)
		.to(CreateAvailabilityUseCase)
		.inSingletonScope();
	container
		.bind<ICheckAndCreateAvailabilityUseCase>(
			TYPES.UseCases.CheckAndCreateAvailability,
		)
		.to(CheckAndCreateAvailabilityUseCase)
		.inSingletonScope();
	container
		.bind<ICheckAndReenableAvailabilityUseCase>(
			TYPES.UseCases.CheckAndReenableAvailability,
		)
		.to(CheckAndReenableAvailabilityUseCase)
		.inSingletonScope();
	container
		.bind<IUpdateAvailabilityUseCase>(TYPES.UseCases.UpdateAvailability)
		.to(UpdateAvailabilityUseCase)
		.inSingletonScope();
	container
		.bind<IDeleteAvailabilityUseCase>(TYPES.UseCases.DeleteAvailability)
		.to(DeleteAvailabilityUseCase)
		.inSingletonScope();
	container
		.bind<IReenableAvailabilityUseCase>(TYPES.UseCases.ReenableAvailability)
		.to(ReenableAvailabilityUseCase)
		.inSingletonScope();
	container
		.bind<IGetMentorAvailabilitiesUseCase>(
			TYPES.UseCases.GetMentorAvailabilities,
		)

		.to(GetMentorAvailabilitiesUseCase)
		.inSingletonScope();

	// Controller
	container
		.bind<AvailabilityController>(TYPES.Controllers.Availability)
		.to(AvailabilityController)
		.inSingletonScope();
};
