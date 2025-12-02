import { COOKIE_OPTIONS } from "../../../common/constants/cookieOptions";
import { HttpStatus, ResponseMessage } from "../../../common/enums";
import {
	ICreateInterestsUC,
	IRegisterUserUC,
	IResendRegisterOtpUC,
	IVerifyOtpUC,
} from "../../../domain/useCases/userRegistration";
import env from "../../../infrastructure/config/env";
import asyncHandler from "../utils/asyncHandler";
import {
	registerSchema,
	resendOtpSchema,
	verifyOtpSchema,
} from "../validations/auth.validation";
import { Response } from "express";
import { addInterestsSchema } from "../validations/interests.validation";

export class RegistrationController {
	constructor(
		private _registerUserUC: IRegisterUserUC,
		private _verifyOtpUC: IVerifyOtpUC,
		private _resendRegisterOtpUC: IResendRegisterOtpUC,
		private _createInterestsUC: ICreateInterestsUC,
	) {}

	/** Sets registration or reset OTP token cookie */
	private setTokenCookie(
		res: Response,
		type: "reset" | "register",
		token: string,
	) {
		const cookieName = type === "reset" ? "resettoken" : "registertoken";
		res.cookie(cookieName, token, {
			...COOKIE_OPTIONS,
			maxAge: parseInt(env.RESET_TOKEN_EXPIRY),
		});
	}

	/** Clears registration OTP cookies */
	private clearTokenCookie(res: Response, type: "reset" | "register") {
		res.clearCookie(type === "reset" ? "resettoken" : "registertoken");
	}

	/** Register new user & send OTP */
	public register = asyncHandler(async (req, res) => {
		const { name, email, phone, password } = registerSchema.parse(req.body);

		await this._registerUserUC.execute({ name, email, phone, password });

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_SENT });
	});

	/** verify registration OTP */
	public verifyOtp = asyncHandler(async (req, res) => {
		const { email, otp } = verifyOtpSchema.parse(req.body);
		const token = await this._verifyOtpUC.execute(email, otp);

		this.setTokenCookie(res, "register", token);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_VERIFIED });
	});

	/** Resend registration OTP */
	public resendOtp = asyncHandler(async (req, res) => {
		const { email } = resendOtpSchema.parse(req.body);

		await this._resendRegisterOtpUC.execute(email);

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.OTP_RESENT });
	});

	/** Add interests after OTP verification */
	public addInterests = asyncHandler(async (req, res) => {
		const { selectedAreas, selectedTopics, email, newAreas, newTopics } =
			addInterestsSchema.parse(req.body);

		const token = req.cookies.registertoken;

		await this._createInterestsUC.execute({
			email,
			expertises: selectedAreas,
			skills: selectedTopics,
			newExpertises: newAreas,
			newTopics: newTopics,
			token,
		});

		this.clearTokenCookie(res, "register");

		res
			.status(HttpStatus.OK)
			.json({ success: true, message: ResponseMessage.INTERESTS_ADDED });
	});
}
