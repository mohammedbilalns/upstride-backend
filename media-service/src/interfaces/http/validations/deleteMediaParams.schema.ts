import {z} from "zod"

export const deleteMediaParamsSchema = z.object({
	publicId: z.string().min(1,"PublicId is required"),
	mediaType: z.string().min(1,"MediaType is required"),
})
