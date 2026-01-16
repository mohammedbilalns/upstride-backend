import { IUserRepository } from "../../../domain/repositories";
import { IRevokedUserRepository } from "../../../domain/repositories/revokeduser.repository.interface";
import { IBlockUserUC } from "../../../domain/useCases/userManagement/block-user.uc.interface";
import { BlockUserDto } from "../../dtos/user.dto";

export class BlockUserUC implements IBlockUserUC {
  constructor(
    private _userRepository: IUserRepository,
    private _revokedUserRepository: IRevokedUserRepository,
  ) {}

  async execute(dto: BlockUserDto): Promise<void> {
    const { userId } = dto;
    Promise.all([
      this._userRepository.update(userId, { isBlocked: true })
      ,this._revokedUserRepository.add(userId)
    ])
  }
}
