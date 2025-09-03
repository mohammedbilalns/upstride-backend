export interface CreateSignatureResponse {
  signature: string;
  timeStamp: number;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
}

export interface IMediaDto {
  mediaType: "image" | "video" | "audio" | "document";
  category: string;
  publicId: string;
  originalName: string;
  url: string;
  size: number;
  articleId?: string;
  chatMessageId?: string;
  mentorId?: string;
  userId: string;
}

export interface getMediaDto {
  publicId: string;
  articleId?: string;
  chatMessageId?: string;
  mentorId?: string;
  userId?: string;
}

export interface getMediaData extends getMediaDto {
  userId: string;
}

export interface uploadMediaDto {
  mediaType: "image" | "video" | "audio" | "document";
  category: string;
  publicId: string;
  originalName: string;
  url: string;
  size: number;
  articleId?: string;
  chatMessageId?: string;
  mentorId?: string;
  userId: string;
}

export interface getMediasDto {
  publicIds: string[];
}
