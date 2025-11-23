import type { Availability } from "../entities/availability.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IAvailabilityRepository
	extends IBaseRepository<Availability> {}
