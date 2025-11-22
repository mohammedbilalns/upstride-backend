import type { Booking } from "../entities/booking.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IBookingRepository extends IBaseRepository<Booking> {}
