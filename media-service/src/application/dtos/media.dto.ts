export interface CreateSignatureResponse {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
  upload_preset: string;
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

export interface SaveMediaDto {
  resource_type: "image" | "video" | "audio" | "document";
  category: string;
  public_id: string;
  original_filename: string;
  secure_url: string;
  bytes: number;
  asset_folder?: string;
  articleId?: string;
  chatMessageId?: string;
  mentorId?: string;
  userId: string;
}

export interface getMediasDto {
  publicIds: string[];
}
