import { ChatEvent } from "../entities/chatEvent.entity";
import { IBaseRepository } from "./base.repository.interface";


export interface IChatEventRepository  extends IBaseRepository<ChatEvent> {}

