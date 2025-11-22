import { Availability } from "../entities/availability.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IAvailabilityRepository
	extends IBaseRepository<Availability> {}
