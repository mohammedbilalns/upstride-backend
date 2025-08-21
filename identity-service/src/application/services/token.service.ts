import { ITokenService } from "../../domain/services";
import env from "../../infrastructure/config/env";
import jwt from "jsonwebtoken"
import { UserDTO } from "../dtos/userDto";
import { AppError } from "../errors/AppError";
import { ErrorMessage, HttpStatus } from "../../common/enums";

export interface GoogleTokenPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export class TokenService implements ITokenService {
  constructor(private jwtSecret: string) { }

  generateAccessToken(user: UserDTO): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.roles, type: "access" },
      this.jwtSecret,
      { expiresIn: parseInt(env.ACCESS_TOKEN_EXPIRY) }
    );
  }

  generateRefreshToken(user: UserDTO): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.roles, type: "refresh" },
      this.jwtSecret,
      { expiresIn: parseInt(env.REFRESH_TOKEN_EXPIRY) }
    );
  }

  verifyAccessToken(token: string): { id: string; email: string; role: string; } {
    const decoded = jwt.verify(token, this.jwtSecret) as { id: string, email: string, role: string, type: string };
    if (decoded.type !== "access") {
      throw new AppError(ErrorMessage.INVALID_TOKEN_TYPE, HttpStatus.UNAUTHORIZED);
    }
    return decoded
  }

  verifyRefreshToken(token: string): { id: string; email: string; role: string; } {
    const decoded = jwt.verify(token, this.jwtSecret) as { id: string, email: string, role: string, type: string }
    if (decoded.type !== 'refresh') {
      throw new AppError(ErrorMessage.INVALID_TOKEN_TYPE, HttpStatus.UNAUTHORIZED);
    }
    return decoded
  }
  decodeGoogleToken(token: string): { sub: string; email: string; name: string; picture: string; } {
    return jwt.decode(token) as GoogleTokenPayload
  }
}