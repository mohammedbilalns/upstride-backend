import { z } from "zod";

export const mediaPayloadSchema = z.object({
  resource_type: z.enum(["image", "video", "audio", "document"]),
  category: z.string(),
  public_id: z.string(),
  original_filename: z.string(),
  secure_url: z.url(),
  bytes: z.number(),
  articleId: z.string().optional(),
  chatMessageId: z.string().optional(),
  mentorId: z.string().optional(),
  asset_folder: z.string().optional(),
  userId: z.string(),
});
