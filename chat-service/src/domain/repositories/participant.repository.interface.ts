import { Participant } from "../entities/participant.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IParticipantRepository extends IBaseRepository<Participant> {}
