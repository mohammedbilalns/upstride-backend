import {
	DeleteObjectCommand,
	GetObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { injectable } from "inversify";
import type {
	IStorageService,
	PresignedPostResponse,
} from "../../application/services";
import env from "../../shared/config/env";

// Stores files in S3 and issues signed access/upload URLs.
@injectable()
export class S3StorageService implements IStorageService {
	private _s3: S3Client;
	private _bucket: string;

	constructor() {
		this._bucket = env.AWS_BUCKET_NAME;
		this._s3 = new S3Client({
			region: env.AWS_REGION,
			credentials: {
				accessKeyId: env.AWS_ACCESS_KEY_ID,
				secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
			},
		});
	}

	async delete(objectKey: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: this._bucket,
			Key: objectKey,
		});

		await this._s3.send(command);
	}

	async getSignedUrl(objectKey: string, expiresIn = 3600): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this._bucket,
			Key: objectKey,
		});

		return getSignedUrl(this._s3, command, { expiresIn });
	}

	getPublicUrl(objectKey: string): string {
		const safeKey = objectKey
			.split("/")
			.map((segment) => encodeURIComponent(segment))
			.join("/");
		return `https://${this._bucket}.s3.${env.AWS_REGION}.amazonaws.com/${safeKey}`;
	}

	async getPresignedPost(
		objectKey: string,
		mimetype: string,
		maxSizeBytes = 10485760,
		expiresIn = 300,
	): Promise<PresignedPostResponse> {
		const { url, fields } = await createPresignedPost(
			this._s3 as unknown as Parameters<typeof createPresignedPost>[0],
			{
				Bucket: this._bucket,
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
