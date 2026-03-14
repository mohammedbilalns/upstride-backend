export const OtpPurpose = {
	REGISTER: "REGISTER",
	RESET_PASSWORD: "RESET_PASSWORD",
	CHANGE_PASSWORD: "CHANGE_PASSWORD",
} as const;

export type OtpPurpose = (typeof OtpPurpose)[keyof typeof OtpPurpose];
