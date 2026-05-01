import type { Container } from "inversify";
import { CheckAndCreateAvailabilityUseCase } from "../../application/modules/availability/use-cases/check-and-create-availability.use-case";
import type { ICheckAndCreateAvailabilityUseCase } from "../../application/modules/availability/use-cases/check-and-create-availability.use-case.interface";
import { CheckAndReenableAvailabilityUseCase } from "../../application/modules/availability/use-cases/check-and-reenable-availability.use-case";
import type { ICheckAndReenableAvailabilityUseCase } from "../../application/modules/availability/use-cases/check-and-reenable-availability.use-case.interface";
import { CheckAndUpdateAvailabilityUseCase } from "../../application/modules/availability/use-cases/check-and-update-availability.use-case";
import type { ICheckAndUpdateAvailabilityUseCase } from "../../application/modules/availability/use-cases/check-and-update-availability.use-case.interface";
import { CreateAvailabilityUseCase } from "../../application/modules/availability/use-cases/create-availability.use-case";
import type { ICreateAvailabilityUseCase } from "../../application/modules/availability/use-cases/create-availability.use-case.interface";
import { DeleteAvailabilityUseCase } from "../../application/modules/availability/use-cases/delete-availability.use-case";
import type { IDeleteAvailabilityUseCase } from "../../application/modules/availability/use-cases/delete-availability.use-case.interface";
import { GetMentorAvailabilitiesUseCase } from "../../application/modules/availability/use-cases/get-mentor-availabilities.use-case";
import type { IGetMentorAvailabilitiesUseCase } from "../../application/modules/availability/use-cases/get-mentor-availabilities.use-case.interface";
import { ReenableAvailabilityUseCase } from "../../application/modules/availability/use-cases/reenable-availability.use-case";
import type { IReenableAvailabilityUseCase } from "../../application/modules/availability/use-cases/reenable-availability.use-case.interface";
import { UpdateAvailabilityUseCase } from "../../application/modules/availability/use-cases/update-availability.use-case";
import type { IUpdateAvailabilityUseCase } from "../../application/modules/availability/use-cases/update-availability.use-case.interface";
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
		.bind<ICheckAndUpdateAvailabilityUseCase>(
			TYPES.UseCases.CheckAndUpdateAvailability,
		)
		.to(CheckAndUpdateAvailabilityUseCase)
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
