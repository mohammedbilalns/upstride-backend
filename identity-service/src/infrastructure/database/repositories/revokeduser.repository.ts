import { IRevokedUserRepository } from "../../../domain/repositories/revokeduser.repository.interface";
import { Redis } from "ioredis";

export class RevokedUserRepository implements IRevokedUserRepository {
  constructor(private readonly redisClient: Redis) {}

  async isRevoked(id: string): Promise<boolean> {
    const exists = await this.redisClient.exists(`revokedUser:${id}`);
    return exists === 1;
  }
  async add(id: string): Promise<void> {
    await this.redisClient.set(`revokedUser:${id}`, "1", "EX", 900000);
  }

  async remove(id: string): Promise<void> {
    await this.redisClient.del(`revokedUser:${id}`);
  }
}
