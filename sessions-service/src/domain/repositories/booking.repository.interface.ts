import { Booking } from "../entities/booking.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IBookingRepository extends IBaseRepository<Booking> {}
