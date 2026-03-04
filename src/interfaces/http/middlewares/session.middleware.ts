import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../../application/authentication/errors";
import type { ITokenService } from "../../../application/services";
import type { ITokenRevocationRepository } from "../../../domain/repositories/token-revokation.repository.interface";
import { container } from "../../../main/container";
import logger from "../../../shared/logging/logger";
import { TYPES } from "../../../shared/types/types";

export const verifySession = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			throw new UnauthorizedError();
		}

		const token = authHeader.split(" ")[1];

		const tokenService = container.get<ITokenService>(
			TYPES.Services.TokenService,
		);
		const tokenRevocationRepository = container.get<ITokenRevocationRepository>(
			TYPES.Repositories.TokenRevocationRepository,
		);

		const payload = tokenService.verifyAccessToken(token);

		const isRevoked = await tokenRevocationRepository.isSessionRevoked(
			payload.sid,
		);

		if (isRevoked) {
			throw new UnauthorizedError();
		}

		req.user = {
			id: payload.sub,
			role: payload.role,
			sid: payload.sid,
		};
		next();
	} catch (error) {
		logger.error(`Failed to validate session: ${error}`);
		next(error instanceof UnauthorizedError ? error : new UnauthorizedError());
	}
};
