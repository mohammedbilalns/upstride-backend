import {z} from "zod"

export const mailPayloadSchema = z.object({
	to:z.string(),
	subject:z.string(),
	text:z.string(),
})
