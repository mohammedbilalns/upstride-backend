import type { ChatEvent } from "../entities/chatEvent.entity";
import type { IBaseRepository } from "./base.repository.interface";

export interface IChatEventRepository extends IBaseRepository<ChatEvent> {}
