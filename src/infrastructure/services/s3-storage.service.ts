import { randomUUID } from "node:crypto";
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type {
	File,
	IStorageService,
	PresignedPostResponse,
} from "../../application/services";
import env from "../../shared/config/env";

// Stores files in S3 and issues signed access/upload URLs.
export class S3StorageService implements IStorageService {
	private s3: S3Client;
	private bucket: string;

	constructor() {
		this.bucket = env.AWS_BUCKET_NAME;
		this.s3 = new S3Client({
			region: env.AWS_REGION,
			credentials: {
				accessKeyId: env.AWS_ACCESS_KEY_ID,
				secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
			},
		});
	}

	async upload(file: File, folder?: string): Promise<string> {
		const fileExtension = file.originalname.split(".").pop();
		const key = folder
			? `${folder}/${randomUUID()}.${fileExtension}`
			: `${randomUUID()}.${fileExtension}`;

		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype,
		});

		await this.s3.send(command);

		return key;
	}

	async delete(objectKey: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: objectKey,
		});

		await this.s3.send(command);
	}

	async getSignedUrl(objectKey: string, expiresIn = 3600): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucket,
			Key: objectKey,
		});

		return getSignedUrl(this.s3, command, { expiresIn });
	}

	async getSignedUploadUrl(
		objectKey: string,
		mimetype: string,
		expiresIn = 300,
	): Promise<string> {
		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: objectKey,
			ContentType: mimetype,
		});

		return getSignedUrl(this.s3, command, { expiresIn });
	}

	async getPresignedPost(
		objectKey: string,
		mimetype: string,
		maxSizeBytes = 10485760,
		expiresIn = 300,
	): Promise<PresignedPostResponse> {
		const { url, fields } = await createPresignedPost(
			this.s3 as unknown as Parameters<typeof createPresignedPost>[0],
			{
				Bucket: this.bucket,
				Key: objectKey,
				Conditions: [
					["content-length-range", 0, maxSizeBytes],
					{ "content-type": mimetype },
				],
				Fields: {
					"content-type": mimetype,
				},
				Expires: expiresIn,
			},
		);

		return { url, fields };
	}
}
