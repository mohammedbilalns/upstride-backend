import { IUserRepository,IVerificationTokenRepository } from "../../domain/repositories";
import {
  ICryptoService,
  IAuthService,
  ITokenService,
} from "../../domain/services";
import { UserDTO } from "../dtos/user.dto";
import { AppError } from "../errors/AppError";
import { HttpStatus, ErrorMessage } from "../../common/enums";
import { generateSecureToken } from "../utils/token.util";
import { GoogleAuthResponse } from "../dtos/auth.dto";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository, 
		private _verificationTokenRepository: IVerificationTokenRepository,
    private _cryptoService: ICryptoService,
    private _tokenService: ITokenService,
  ) {}

  private async generateTokens(
    user: UserDTO,
  ): Promise<{ newAccessToken: string; newRefreshToken: string }> {
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this._tokenService.generateAccessToken(user),
      this._tokenService.generateRefreshToken(user),
    ]);
    return { newAccessToken, newRefreshToken };
  }

  
  async loginUser(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: UserDTO }> {
    const user = await this._userRepository.findByEmail(email);

    if (!user || !user.isVerified)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    if (user.googleId && !user.passwordHash) {
      throw new AppError(
        ErrorMessage.ALERADY_WITH_GOOGLE_ID,
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.passwordHash)
      throw new AppError(
        ErrorMessage.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    if (user.isBlocked)
      throw new AppError(
        ErrorMessage.BLOCKED_FROM_PLATFORM,
        HttpStatus.FORBIDDEN,
      );
    const isPasswordValid = await this._cryptoService.compare(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid)
      throw new AppError(
        ErrorMessage.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    const { passwordHash, isBlocked, isVerified, googleId, ...publicUser } =
      user;
    return {
      accessToken: this._tokenService.generateAccessToken(user),
      refreshToken: this._tokenService.generateRefreshToken(user),
      user: publicUser,
    };
  }


  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = this._tokenService.verifyRefreshToken(refreshToken);
    const { id } = decoded;
    const user = await this._userRepository.findById(id);
    if (!user)
      throw new AppError(ErrorMessage.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    if (user && user.isBlocked)
      throw new AppError(
        ErrorMessage.BLOCKED_FROM_PLATFORM,
        HttpStatus.FORBIDDEN,
      );

    const { newAccessToken, newRefreshToken } = await this.generateTokens(user);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async googleAuthenticate(
    token: string,
  ): Promise< GoogleAuthResponse> {
    const decodedToken = this._tokenService.decodeGoogleToken(token);
    if (!decodedToken)
      throw new AppError(ErrorMessage.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
	
    let user = await this._userRepository.findByEmail(decodedToken.email);
    if (!user) {
      user = await this._userRepository.create({
        email: decodedToken.email,
        name: decodedToken.name,
        isVerified: false,
        googleId: decodedToken.sub,
        profilePicture: decodedToken.picture,
      });

			const token = generateSecureToken()
			this._verificationTokenRepository.saveToken(token, decodedToken.email, "register", 15*60)
			return {token,email: decodedToken.email} 
			
    } else if (!user.googleId) {
      const { id } = user;
      user = await this._userRepository.update(id, {
        googleId: decodedToken.sub,
      });
      if (!user) {
        throw new AppError(
          ErrorMessage.USER_NOT_FOUND,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
		const {passwordHash, isBlocked, isVerified, googleId, ...publicUser} = user
    const { newAccessToken, newRefreshToken } = await this.generateTokens(user);
    return {
      user: publicUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
 
  async isUserBlocked(userId: string): Promise<boolean> {
    const user = await this._userRepository.findById(userId);
    return user?.isBlocked || false;
  }
}
