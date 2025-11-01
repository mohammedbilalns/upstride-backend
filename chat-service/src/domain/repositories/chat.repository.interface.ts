import { Chat } from "../entities/chat.entity";
import { IBaseRepository } from "./base.repository.interface";

export interface IChatRepository extends IBaseRepository<Chat> {}
